import {MAX_CLIENT_OBJECT_SIZE} from 'engine/definitions/constants/networks.constants';
import {PacketDestination} from 'engine/definitions/enums/networks.enums';
import {CustomEventData} from 'engine/definitions/types/scripts.types';

import {EncryptedPacketsDto, ServerDto} from 'engine/generated/dtos.types';

import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';

type EventData = {
  [name: string]: unknown;
};

class NetworkManager {
  private _engine: EngineManager;

  server: ServerDto = null!;

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
    });

    this._messenger.events.on(
      'syncEncryptedPackets',
      ({data: [encryptedPackets]}) => {
        this.encryptedPackets = encryptedPackets;
      },
    );
  }

  onPlayerEvent(
    event: string,
    listener: (player: PlayerManager, data: CustomEventData) => void,
  ) {
    const listenerWrapper = (playerId: number, data?: CustomEventData) => {
      listener(this._engine.players.get(playerId), data!);
    };

    return this._engine.events.on(
      `onPlayerCustomEvent_${event}`,
      listenerWrapper,
    );
  }

  onServerEvent(event: string, listener: (data: CustomEventData) => void) {
    if (this._isServer) {
      throw new Error(
        "You can't use network.onServerEvent server-side. If you're receving an event form the client use network.onPlayerEvent instead",
      );
    }

    const listenerWrapper = (data?: CustomEventData) => {
      listener(data!);
    };

    return this._engine.events.on(
      `onServerCustomEvent_${event}`,
      listenerWrapper,
    );
  }

  offServerEvent(event: string, listener: (data?: CustomEventData) => void) {
    return this._engine.events.off(`onServerCustomEvent_${event}`, listener);
  }

  offPlayerEvent(
    event: string,
    listener: (player: number, data?: CustomEventData) => void,
  ) {
    return this._engine.events.off(`onPlayerCustomEvent_${event}`, listener);
  }

  // client & server
  emitToServer(event: string, data?: EventData) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

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

  emitToPlayers(event: string, data?: EventData) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

    // emit to web server
    if (this._api.isWebServerAvailable) {
      this._api.webServer.emitCustomPacket({
        p: PacketDestination.Client, // PacketDestination

        e: event, // event name

        d: data, // data
      });
    }

    // emit from server
    this._api.emitAction('emitToPlayers', [event, data]);
  }

  emitToPlayer(
    player: PlayerManager | number,
    event: string,
    data?: EventData,
  ) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

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
