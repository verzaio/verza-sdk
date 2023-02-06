import {z} from 'zod';

import {
  ChatPacketSendDto,
  CustomPacketSendDto,
} from 'engine/generated/dtos.types';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {CHAT_MAX_MESSAGE_SIZE} from 'engine/definitions/constants/chat.constants';
import {ServerEndpointPacket} from 'engine/definitions/local/types/api.types';
import {ServerScope} from 'engine/definitions/local/types/api.types';
import EngineManager from 'engine/managers/engine.manager';

const EXPIRE_TIME_MS = 45000; // 45 seconds

class HttpServerManager {
  private _engine: EngineManager;

  private get endpoint() {
    return this._engine.api.endpoint;
  }

  private get _accessToken() {
    return this._engine.api.accessToken;
  }

  httpServerEndpoint: string = null!;

  get encryptedPackets() {
    return this._engine.network.encryptedPackets;
  }

  get isServer() {
    return this._engine.api.isServer;
  }

  get isClient() {
    return this._engine.api.isClient;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;

    // set server endpoint
    if (this._engine.params.httpServer) {
      this.httpServerEndpoint = this._engine.params.httpServer;
    }
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

    this._handlePacket(eventId, packetData);

    return null;
  }

  private _createPlayerFromAuthPacket(packet: string): boolean {
    const authPacket: [number, number] = this._engine.api.decryptPacket(packet);

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

  private _handlePacket(
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
        this.emit(event, data);
      }
    }
  }

  emit(event: PacketEvent, data?: unknown) {
    // ignore if no endpoint or is not client
    if (!this.httpServerEndpoint || !this.isClient) return;

    // prepare packet
    const packet: ServerEndpointPacket = [
      event,
      data ?? null,
      this.encryptedPackets.auth,
    ];

    // emit script server
    fetch(this.httpServerEndpoint, {
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
}

const isObject = (value: unknown) => {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
  );
};

export default HttpServerManager;
