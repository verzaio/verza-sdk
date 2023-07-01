import {z} from 'zod';

import {CHAT_MAX_MESSAGE_SIZE} from 'engine/definitions/constants/chat.constants';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {ServerEndpointPacket} from 'engine/definitions/local/types/api.types';
import {DiscoverPacketDto} from 'engine/definitions/local/types/discover.types';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import {
  ChatPacketSendDto,
  CustomPacketSendDto,
  ScriptActionPacketSendDto,
} from 'engine/generated/dtos.types';
import EngineManager from 'engine/managers/engine.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

const EXPIRE_TIME_MS = 60000; // 60 seconds

class WebServerManager {
  private _engine: EngineManager;

  private get endpoint() {
    return this._engine.api.endpoint;
  }

  private get _accessToken() {
    return this._engine.api.accessToken;
  }

  declaredCommands: string[] = [];

  commandPacket: [string, string[]] = null!;

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

  bind() {
    const onSync = () => {
      this.emitDiscoverPacket();
      this._engine.events.off('syncEncryptedPackets', onSync);
    };

    this._engine.events.on('syncEncryptedPackets', onSync);
  }

  async handle(rawData: unknown): Promise<unknown> {
    // ignore if not a string
    if (typeof rawData !== 'string') return null;

    // parse
    const data = this._parseEndpointData(rawData);

    // ignore if decoded data is incorrect encoded
    if (!this._isValidEndpointPacket(data)) {
      console.debug(`[api] invalid encoded data`, data);

      if (!data?.[2]) {
        console.debug(`[api] is Access Token correct?`);
      }

      return {
        error: 'invalid encoded data',
      };
    }

    const [eventId, packetData, authPacket, commandPacket] = data;

    // try to create player from auth packet
    if (!this._createPlayerFromAuthPacket(authPacket)) {
      return null!;
    }

    if (commandPacket && !this._createCommandPacket(commandPacket)) {
      return null!;
    }

    return this._handlePacket(eventId, packetData) ?? null;
  }

  private _createCommandPacket(packet: string): boolean {
    const commandPacket = this._engine.api.decryptPacket(packet);

    if (!Array.isArray(commandPacket)) {
      console.debug('[api] cannot decrypt command packet', packet);
      return false;
    }

    const [date, command, roles] = commandPacket;

    const diff = Math.floor(Date.now() / 1000) - date;

    if (diff > EXPIRE_TIME_MS) {
      console.debug(
        `[api] expired command packet: ${commandPacket[0][0]} | diff: ${diff}`,
        commandPacket,
      );
      return false;
    }

    this.commandPacket = [command, roles];

    return true;
  }

  hasAccess(player: PlayerManager, command: string): boolean {
    player;
    command;

    // no declared? then allow it
    if (!this.declaredCommands.includes(command)) {
      return true;
    }

    // no command packet? denied!
    if (!this.commandPacket) {
      return false;
    }

    // extract
    const [cmd, roles] = this.commandPacket;

    //console.log('cmd', player.roles, roles);

    // do not match? denied!
    if (cmd !== command) {
      return false;
    }

    // no role found? denied!
    const hasRole = player.roles.some(e => roles.includes(e));

    if (!hasRole) {
      return false;
    }

    // allow it
    return true;
  }

  private _createPlayerFromAuthPacket(packet: string): boolean {
    const authPacket: [number, number, string[], string[]] =
      this._engine.api.decryptPacket(packet);

    if (!Array.isArray(authPacket)) {
      console.debug(
        '[api] cannot decrypt packet, do we have the correct Access Token?',
        packet,
      );
      return false;
    }

    const [date, playerId, roles, commands] = authPacket;

    const diff = Math.floor(Date.now() / 1000) - date;

    if (diff > EXPIRE_TIME_MS) {
      console.debug(
        `[api] expired packet playerId: ${playerId} | diff: ${diff}`,
      );
      return false;
    }

    // set declared commands
    this.declaredCommands = commands;

    // set player id
    this._engine.localPlayerId = playerId;

    // create player
    this._engine.players.create(
      playerId,
      {
        roles,
      },
      false,
    );

    return true;
  }

  private _isValidEndpointPacket(data: unknown) {
    if (!Array.isArray(data)) {
      return false;
    }

    // length should be 3
    if (data.length !== 4) {
      console.log('22aac');
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

    // command packet
    if (data[3] !== null && typeof data[3] !== 'string') {
      return false;
    }

    return true;
  }

  private _discoverPacket() {
    const discoverPacket: DiscoverPacketDto = {
      commands: [],
    };

    // commands
    this._engine.commands.commands.forEach(command => {
      discoverPacket.commands.push({
        ...command.toObject(),
        tag: this._engine.name,
      });
    });

    return discoverPacket;
  }

  private _handlePacket(
    event: PacketEvent,
    packet: ChatPacketSendDto | CustomPacketSendDto | null,
  ) {
    switch (event) {
      // chat
      case PacketEvent.Discover: {
        return this._discoverPacket();
      }

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
          this._engine.localPlayer.id,

          parsed.d,
        ]);
        break;
      }
      default: {
        console.debug(`[webserver] unhandled packet: ${event}`);
      }
    }

    return null;
  }

  private _parseEndpointData(data: string): ServerEndpointPacket {
    try {
      return JSON.parse(data) as ServerEndpointPacket;
    } catch (e) {
      console.error(e);
    }

    return null!;
  }

  emitToWebServer(event: PacketEvent, data?: unknown, commandPacket?: string) {
    // ignore if no endpoint or is not client
    if (!this.webServerEndpoint || !this.isClient) return;

    if (!this.encryptedPackets?.auth) {
      console.debug(
        '[api] encypted packets not found, is the "Access Token" generated?',
      );
      return;
    }

    // prepare packet
    const packet: ServerEndpointPacket = [
      event,
      data ?? null,
      this.encryptedPackets?.auth,
      commandPacket ?? null!,
    ];

    // emit script server
    return fetch(this.webServerEndpoint, {
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
    playerId?: number,
  ): Promise<Response> {
    if (!this.isServer) return null!;

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
        p: playerId,
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
        return null!;
      } catch (e) {
        console.error('Verza API Error ', path, await response.text());
        console.error(e);
      }
    }

    return response;
  }

  /* packets */
  async emitDiscoverPacket() {
    // emit
    const result: DiscoverPacketDto = await (
      await this.emitToWebServer(PacketEvent.Discover)
    )?.json();

    if (!result) return;

    if ((result as unknown as {error: string}).error) {
      console.error(`[webserver] error `, result);
      return;
    }

    if (result.commands) {
      result.commands?.forEach(command => {
        this._engine.commands.registerWebServerCommand(command);
      });
    }
  }

  emitChatPacket(text: string, commandPacket?: string) {
    const chatPacket: ChatPacketSendDto = {
      m: text,
    };

    // emit
    this.emitToWebServer(PacketEvent.Chat, chatPacket, commandPacket);
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
