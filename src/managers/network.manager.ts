import {MAX_CLIENT_OBJECT_SIZE} from 'engine/definitions/constants/networks.constants';
import {PacketDestination} from 'engine/definitions/enums/networks.enums';
import {NetworkEventData} from 'engine/definitions/types/scripts.types';
import {
  CommandConfigDto,
  EncryptedPacketsDto,
  ServerDto,
} from 'engine/generated/dtos.types';

import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';

class NetworkManager {
  private _engine: EngineManager;

  server: ServerDto = null!;

  serverCommands: Map<string, CommandConfigDto> = new Map();

  encryptedPackets: EncryptedPacketsDto = null!;

  private get _api() {
    return this._engine.api;
  }

  private get _isClient() {
    return this._engine.api.isClient;
  }

  private get _isServer() {
    return this._engine.api.isServer;
  }

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    // ignore if is server
    if (this._isServer) return;

    this._messenger.events.on('syncServer', ({data: [server, endpoint]}) => {
      this._api.endpoint = endpoint;

      this.server = server;
      this.serverCommands = new Map(server.commands.map(e => [e.command, e]));
    });

    this._messenger.events.on(
      'syncEncryptedPackets',
      ({data: [encryptedPackets]}) => {
        this.encryptedPackets = encryptedPackets;
      },
    );
  }

  onServerEvent(eventName: string, listener: (data: NetworkEventData) => void) {
    if (this._isServer) {
      throw new Error(
        "You can't use network.onServerEvent server-side. If you're receving an event form the client use network.onPlayerEvent instead",
      );
    }

    return this._engine.events.on(
      `onServerCustomEvent_${eventName}`,
      listener as (data?: NetworkEventData) => void,
    );
  }

  onScriptEvent(eventName: string, listener: (data: NetworkEventData) => void) {
    if (!this._isClient) {
      throw new Error(
        "You can't use network.onScriptEvent server-side. If you're receving an event form the client use network.onServerEvent or network.onPlayerEvent instead",
      );
    }

    return this._engine.events.on(
      `onScriptCustomEvent_${eventName}`,
      listener as (data?: NetworkEventData) => void,
    );
  }

  offServerEvent(
    eventName: string,
    listener: (data?: NetworkEventData) => void,
  ) {
    return this._engine.events.off(
      `onServerCustomEvent_${eventName}`,
      listener,
    );
  }

  offScriptEvent(
    eventName: string,
    listener: (data?: NetworkEventData) => void,
  ) {
    return this._engine.events.off(
      `onScriptCustomEvent_${eventName}`,
      listener,
    );
  }

  private _playerEvents = new Map<
    string,
    Map<
      (player: PlayerManager, data?: NetworkEventData) => void,
      (playerId: number, data?: NetworkEventData) => void
    >
  >();

  onPlayerEvent(
    eventName: string,
    listener: (player: PlayerManager, data?: NetworkEventData) => void,
  ) {
    const map = this._playerEvents.get(eventName) ?? new Map();

    const eventListener = this._engine.events.on(
      `onPlayerCustomEvent_${eventName}`,
      (playerId, data) => {
        const player = this._engine.players.get(playerId);
        if (player) {
          listener(player, data);
        }
      },
    );

    map.set(listener, eventListener);
    this._playerEvents.set(eventName, map);

    return listener;
  }

  offPlayerEvent(
    eventName: string,
    listener: (player: PlayerManager, data?: NetworkEventData) => void,
  ) {
    const map = this._playerEvents.get(eventName);
    if (!map) return;

    const eventListener = map.get(listener);
    if (!eventListener) return;

    this._engine.events.off(`onPlayerCustomEvent_${eventName}`, eventListener);
    map.delete(listener);

    if (!map.size) {
      this._playerEvents.delete(eventName);
      return;
    }

    this._playerEvents.set(eventName, map);
  }

  // client & server
  emitToPlayer(
    player: PlayerManager | number,
    event: string,
    data?: NetworkEventData,
  ) {
    // check packet size limit
    if (!this._checkPacketSize(data)) return;

    const playerId = typeof player === 'number' ? player : player.id;

    // emit to web server
    if (this._api.isWebServerAvailable) {
      this._api.webServer.emitCustomPacket({
        p: PacketDestination.Client, // PacketDestination

        e: event, // event name

        d: data, // data

        i: playerId, // player id
      });
    }

    // send to server
    this._api.emitAction('emitToPlayer', [playerId, event, data]);
  }

  emitToPlayers(event: string, data?: NetworkEventData) {
    // check packet size limit
    if (!this._checkPacketSize(data)) return;

    // emit from server
    this._api.emitAction('emitToPlayers', [event, data]);
  }

  emitToPlayersWithAccess(
    event: string,
    command: string,
    data?: NetworkEventData,
  ) {
    // check packet size limit
    if (!this._checkPacketSize(data)) return;

    // emit to server
    this._api.emitAction('emitToPlayersWithAccess', [event, command, data]);
  }

  emitToPlayersWithRoles(
    event: string,
    roles: string[],
    data?: NetworkEventData,
  ) {
    // check packet size limit
    if (!this._checkPacketSize(data)) return;

    // emit to server
    this._api.emitAction('emitToPlayersWithRoles', [event, roles, data]);
  }

  emitToServer(event: string, data?: NetworkEventData) {
    // check packet size limit
    if (!this._checkPacketSize(data)) return;

    // emit to web server
    if (this._api.isWebServerAvailable) {
      this._api.webServer.emitCustomPacket({
        p: PacketDestination.Server, // PacketDestination

        e: event, // event name

        d: data, // data
      });
    }

    // emit from server
    this._api.emitAction('emitToServer', [event, data]);
  }

  emitToScripts(event: string, data?: NetworkEventData) {
    if (!this._isClient) {
      console.debug(`[network] this.emitToScripts is only available on client`);
      return;
    }

    // emit to scripts
    this._messenger.emit('emitToScripts', [event, data]);
  }

  private _checkPacketSize(data: unknown) {
    if (data && JSON.stringify(data).length >= MAX_CLIENT_OBJECT_SIZE) {
      console.debug(
        `[network] event data exceed the size limit (max: ${MAX_CLIENT_OBJECT_SIZE})`,
      );
      return false;
    }

    return true;
  }
}

export default NetworkManager;
