import {z} from 'zod';

import EngineManager from './engine.manager';
import {
  decryptMessage,
  encryptMessage,
  hexToBase64Key,
} from 'engine/utils/encryption.utils';
import {ChatPacketSendDto, CustomPacketSendDto} from 'types/Dto';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {CHAT_MAX_MESSAGE_SIZE} from 'engine/definitions/constants/chat.constants';
import {ServerEndpointPacket} from 'engine/definitions/local/types/api.types';
import {ServerScope} from 'engine/definitions/local/types/api.types';

const DEFAULT_ENV_ACCESS_TOKEN_NAME = 'VERZA_ACCESS_TOKEN';

const PROD_ENDPOINT = 'https://api.verza.io';

const DEV_ENDPOINT = 'https://dev-api.verza.io';

const EXPIRE_TIME_MS = 45000; // 45 seconds

class ApiManager {
  private _engine: EngineManager;

  endpoint: string = PROD_ENDPOINT;

  private _scriptEndpoint: string = null!;

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

    this._updateAccessToken();

    // set server endpoint
    if (this._engine.params.serverEndpoint) {
      this._scriptEndpoint = this._engine.params.serverEndpoint;
    }

    // update only on server
    if (this.isServer) {
      this._setEndpoint();
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

  private _updateAccessToken() {
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
    if (typeof window !== 'undefined') {
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

    this._handleEndpointPacket(eventId, packetData);

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

  private _handleEndpointPacket(
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
        this.emitToScriptServer(event, data);
      }
    }
  }

  emitToScriptServer(event: PacketEvent, data?: unknown) {
    // ignore if no endpoint or is not client
    if (!this._scriptEndpoint || !this.isClient) return;

    // prepare packet
    const packet: ServerEndpointPacket = [
      event,
      data ?? null,
      this.encryptedPackets.auth,
    ];

    // emit script server
    fetch(this._scriptEndpoint, {
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

      mode: 'no-cors',

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
