import {z} from 'zod';

import {io, Socket} from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';

import EngineManager from './engine.manager';
import {
  decryptMessage,
  encryptMessage,
  hexToBase64Key,
} from 'engine/utils/encryption.utils';
import {ChatPacketSendDto, CustomPacketSendDto, ServerDto} from 'types/Dto';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {CHAT_MAX_MESSAGE_SIZE} from 'engine/definitions/constants/chat.constants';
import {ServerEndpointPacket} from 'engine/definitions/local/types/api.types';
import {ServerScope} from 'engine/definitions/local/types/api.types';

const DEFAULT_ENV_ACCESS_TOKEN_NAME = 'VERZA_ACCESS_TOKEN';

const PROD_ENDPOINT = 'https://api.verza.io';

const DEV_ENDPOINT = 'https://dev-api.verza.io';

const EXPIRE_TIME_MS = 45000; // 45 seconds

const WS_NAMESPACE = 'n';

class ApiManager {
  private _engine: EngineManager;

  socket: Socket = null!;

  endpoint: string = PROD_ENDPOINT;

  server: ServerDto = null!;

  private _httpServer: string = null!;

  private _accessToken: string = null!;

  private _accessTokenBase64: string = null!;

  get isServer() {
    return this.isApi;
  }

  get isClient() {
    return !this.isApi;
  }

  get isApi() {
    return !!this._accessToken;
  }

  get network() {
    return this._engine.network;
  }

  get encryptedPackets() {
    return this._engine.network.encryptedPackets;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;

    this._setEndpoint();

    this._setAccessToken();

    // set server endpoint
    if (this._engine.params.httpServer) {
      this._httpServer = this._engine.params.httpServer;
    }
  }

  private _setEndpoint() {
    const {environment, apiEndpoint} = this._engine.params;

    if (apiEndpoint) {
      this.endpoint = apiEndpoint;
      return;
    }

    // set from env
    if (process.env['VERZA_API_ENDPOINT']) {
      this.endpoint = process.env['VERZA_API_ENDPOINT'];
      return;
    }

    switch (environment) {
      case 'prod': {
        this.endpoint = PROD_ENDPOINT;
        break;
      }
      case 'dev': {
        this.endpoint = DEV_ENDPOINT;
        break;
      }
    }
  }

  private _setAccessToken() {
    // get from engine params
    let accessToken = this._engine.params.accessToken;

    // check for API Key
    if (!accessToken) {
      if (
        typeof process !== 'undefined' &&
        process.env[DEFAULT_ENV_ACCESS_TOKEN_NAME]
      ) {
        accessToken = process.env[DEFAULT_ENV_ACCESS_TOKEN_NAME];
      }

      if (!accessToken) return;
    }

    // abort if using it on the client
    if (
      !this.endpoint.startsWith('http://localhost') &&
      typeof window !== 'undefined'
    ) {
      throw new Error(
        'DO NOT INCLUDE THE "ACCESS TOKEN" IN CLIENT-SIDE SCRIPTS',
      );
    }

    // set api key
    this._accessToken = accessToken;

    // set base64 key
    this._accessTokenBase64 = hexToBase64Key(this._accessToken);
  }

  encryptPacket(data: unknown) {
    return encryptMessage(data, this._accessTokenBase64);
  }

  decryptPacket(data: string) {
    return decryptMessage(data, this._accessTokenBase64);
  }

  async handle(rawData: unknown): Promise<unknown> {
    // ignore if not a string
    if (typeof rawData !== 'string') return null;

    // parse
    const data = this._parseEndpointData(rawData);

    // ignore if decoded data is incorrect encoded
    if (!this._isValidEndpointPacket(data)) {
      console.debug(`[api] invalid encoded data`, data);

      return {
        error: 'invalid encoded data',
      };
    }

    const [eventId, packetData, authPacket] = data;

    // try to create player from auth packet
    if (!this._createPlayerFromAuthPacket(authPacket)) {
      return null!;
    }

    this._handleHTTPServerPacket(eventId, packetData);

    return null;
  }

  private _createPlayerFromAuthPacket(packet: string): boolean {
    const authPacket: [number, number] = this.decryptPacket(packet);

    if (!Array.isArray(authPacket)) {
      console.debug('[api] cannot decrypt packet', packet);
      return false;
    }

    const [playerId, date] = authPacket;

    const diff = Math.floor(Date.now() / 1000) - date;

    if (diff > EXPIRE_TIME_MS) {
      console.debug(
        `[api] expired packet playerId: ${playerId} | diff: ${diff}`,
      );
      return false;
    }

    // set player id
    this._engine.playerId = playerId;

    // create player
    this._engine.players.create(playerId);

    return true;
  }

  private _isValidEndpointPacket(data: unknown) {
    if (!Array.isArray(data)) {
      return false;
    }

    // length should be 3
    if (data.length !== 3) {
      return false;
    }

    // packet id
    if (typeof data[0] !== 'string') {
      return false;
    }

    // packet id
    if (data[1] !== null && !isObject(data[1])) {
      return false;
    }

    // auth packet
    if (typeof data[2] !== 'string') {
      return false;
    }

    return true;
  }

  private _handleHTTPServerPacket(
    event: PacketEvent,
    packet: ChatPacketSendDto | CustomPacketSendDto | null,
  ) {
    switch (event) {
      // chat
      case PacketEvent.Chat: {
        // validation
        const parsed = z
          .object({
            m: z.string().min(1).max(CHAT_MAX_MESSAGE_SIZE), // message
          })
          .parse(packet);

        this._engine.messenger.emitLocal('onChat', [parsed.m]);
        break;
      }
      // custom
      case PacketEvent.Custom: {
        // validation
        const parsed = z
          .object({
            e: z.string().min(1).max(256), // message

            d: z.object({}).passthrough().optional(), // data
          })
          .parse(packet);

        this._engine.messenger.emitLocal(`onServerCustomEvent_${parsed.e}`, [
          parsed.d,
        ]);
        break;
      }
      default: {
        console.debug(`[api] unhandled packet for api endpoint: ${event}`);
      }
    }
  }

  private _parseEndpointData(data: string): ServerEndpointPacket {
    try {
      return JSON.parse(data) as ServerEndpointPacket;
    } catch (e) {
      console.error(e);
    }

    return null!;
  }

  emitChat(text: string, playerId?: number, scope?: ServerScope) {
    const chatPacket: ChatPacketSendDto = {
      m: text,

      p: playerId,
    };

    // emit
    this.emitPacket(PacketEvent.Chat, chatPacket, scope);
  }

  emitPacket(event: PacketEvent, data?: unknown, scope?: ServerScope) {
    if (this.isServer) {
      if (!scope || scope === 'remote') {
        this.emitToServerAction(event, data);
      }
    } else {
      if (!scope || scope === 'script') {
        this.emitToHTTPServer(event, data);
      }
    }
  }

  emitToHTTPServer(event: PacketEvent, data?: unknown) {
    // ignore if no endpoint or is not client
    if (!this._httpServer || !this.isClient) return;

    // prepare packet
    const packet: ServerEndpointPacket = [
      event,
      data ?? null,
      this.encryptedPackets.auth,
    ];

    // emit script server
    fetch(this._httpServer, {
      method: 'POST',

      cache: 'no-cache',

      keepalive: true,

      referrerPolicy: 'no-referrer',

      credentials: 'omit',

      mode: 'no-cors',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(packet),
    });
  }

  async emitToServerAction(event: PacketEvent, data: unknown) {
    if (!this.isServer) return;

    // format path
    const path = `${this.endpoint}/network/action/${event}`;

    // emit to verza servers
    const response = await fetch(path, {
      method: 'POST',

      cache: 'no-cache',

      keepalive: true,

      referrerPolicy: 'no-referrer',

      credentials: 'omit',

      body: JSON.stringify(data),

      headers: {
        'Content-Type': 'application/json',

        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    // if error, output it
    if (response.status < 200 || response.status > 299) {
      try {
        console.error(
          'Verza API',
          path,
          JSON.stringify(await response.json(), null, 2),
        );
      } catch (e) {
        console.error('Verza API Error ', path, await response.text());
        console.error(e);
      }
    }
  }

  private async _fetchServer(): Promise<ServerDto> {
    const response = await fetch(`${this.endpoint}/network/action/server`, {
      method: 'GET',

      cache: 'no-cache',

      keepalive: true,

      referrerPolicy: 'no-referrer',

      credentials: 'omit',

      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    // if error, output it
    if (response.status < 200 || response.status > 299) {
      try {
        console.error(
          'Verza API',
          JSON.stringify(await response.json(), null, 2),
        );
      } catch (e) {
        console.error('Verza API Error ', await response.text());
        console.error(e);
      }
    }

    return (await response.json()) as ServerDto;
  }

  async connectWs() {
    if (!this._accessToken) {
      console.debug('[api] accessToken is missing');
      return;
    }

    this.disconnectWs();

    this.socket = io(`${this.endpoint}/${WS_NAMESPACE}`, {
      path: '/websockets',
      withCredentials: true,
      query: {
        api_key: this._accessToken,
      },
      transports: ['websocket'],
      upgrade: false,
      parser: msgpackParser,

      autoConnect: false,
      reconnection: true,
      timeout: 5000,
    });

    const onConnect = async () => {
      console.info(
        `%c[VerzaServer] ${WS_NAMESPACE} connected!`,
        'color: #5b75ff',
      );

      if (!this.socket.active) {
        return;
      }

      this.socket.emit(PacketEvent.ScriptJoin);
    };

    const onReconnect = () => {
      console.info(
        `%c[VerzaServer] ${WS_NAMESPACE} reconnected!`,
        'color: #5b75ff',
      );
    };

    const onReconnectAttempt = () => {
      console.info(
        `%c[VerzaServer] ${WS_NAMESPACE} reconnect attempt!`,
        'color: #5b75ff',
      );
    };

    const onException = (err: unknown) => {
      console.warn(`[VerzaServer] ${WS_NAMESPACE}`, err);
    };

    const onDisconnect = () => {
      console.info(
        `%c[VerzaServer] ${WS_NAMESPACE} disconnected!`,
        'color: #fe547e',
      );
    };

    // load server
    this.server = await this._fetchServer();

    // abort if closed
    if (!this.socket) return;

    // listen for the server script's client
    this.socket.on(`s/${this.server.id}/s`, this._handleWebsocketPacket);

    this.socket.on('connect', onConnect);
    this.socket.on('reconnect_attempt', onReconnectAttempt);
    this.socket.on('reconnect', onReconnect);
    this.socket.on('exception', onException);
    this.socket.on('disconnect', onDisconnect);

    this.socket.connect();
  }

  private _handleWebsocketPacket(packet: unknown) {
    console.log('packet', packet);
  }

  disconnectWs() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null!;
  }

  destroy() {
    this.disconnectWs();
  }
}

const isObject = (value: unknown) => {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
  );
};

export default ApiManager;
