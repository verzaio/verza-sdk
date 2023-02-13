import {CHAT_MAX_MESSAGE_SIZE} from 'engine/definitions/constants/chat.constants';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {ServerEndpointPacket} from 'engine/definitions/local/types/api.types';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';

import EngineManager from 'engine/managers/engine.manager';

import {
  ChatPacketSendDto,
  CustomPacketSendDto,
  ScriptActionPacketSendDto,
} from 'engine/generated/dtos.types';

import {z} from 'zod';

const EXPIRE_TIME_MS = 45000; // 45 seconds

class WebServerManager {
  private _engine: EngineManager;

  private get endpoint() {
    return this._engine.api.endpoint;
  }

  private get _accessToken() {
    return this._engine.api.accessToken;
  }

  webServerEndpoint: string = null!;

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
    if (this._engine.params.webServer) {
      this.webServerEndpoint = this._engine.params.webServer;
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
      console.debug(
        '[api] cannot decrypt packet, do we have the correct Access Token?',
        packet,
      );
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

        this._engine.messenger.emitLocal(`onPlayerCustomEvent_${parsed.e}`, [
          this._engine.player.id,

          parsed.d,
        ]);
        break;
      }
      default: {
        console.debug(`[webserver] unhandled packet: ${event}`);
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

  emitToWebServer(event: PacketEvent, data?: unknown) {
    // ignore if no endpoint or is not client
    if (!this.webServerEndpoint || !this.isClient) return;

    // prepare packet
    const packet: ServerEndpointPacket = [
      event,
      data ?? null,
      this.encryptedPackets.auth,
    ];

    // emit script server
    fetch(this.webServerEndpoint, {
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

  async emitAction<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
  ) {
    if (!this.isServer) return;

    // format path
    const path = `${this.endpoint}/network/action/run`;

    // emit to verza servers
    const response = await fetch(path, {
      method: 'POST',

      cache: 'no-cache',

      keepalive: true,

      referrerPolicy: 'no-referrer',

      credentials: 'omit',

      body: JSON.stringify({
        e: eventName,
        d: args as object,
      } satisfies ScriptActionPacketSendDto),

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

  /* packets */
  emitChatPacket(text: string) {
    const chatPacket: ChatPacketSendDto = {
      m: text,
    };

    // emit
    this.emitToWebServer(PacketEvent.Chat, chatPacket);
  }

  emitCustomPacket(dto: CustomPacketSendDto) {
    // emit
    this.emitToWebServer(PacketEvent.Custom, dto);
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

export default WebServerManager;
