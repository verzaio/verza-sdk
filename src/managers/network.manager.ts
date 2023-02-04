import {MAX_CLIENT_OBJECT_SIZE} from 'engine/definitions/constants/networks.constants';
import {CustomEventData} from 'engine/definitions/types/events.types';
import {CustomPacketSendDto, EncryptedPacketsDto, ServerDto} from 'types/Dto';
import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';
import {
  PacketDestination,
  PacketEvent,
} from 'engine/definitions/enums/networks.enums';

type EventData = {
  [name: string]: unknown;
};

class NetworkManager {
  private _engine: EngineManager;

  server: ServerDto = null!;

  encryptedPackets: EncryptedPacketsDto = null!;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    // ignore if is server
    if (this._engine.isServer) return;

    this._messenger.events.on('syncServer', ({data: [server, endpoint]}) => {
      this._engine.api.endpoint = endpoint;

      this.server = server;
    });

    this._messenger.events.on(
      'syncEncryptedPackets',
      ({data: [encryptedPackets]}) => {
        this.encryptedPackets = encryptedPackets;
      },
    );
    //
  }

  onPlayersEvent(
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

  offPlayersEvent(
    event: string,
    listener: (player: number, data?: CustomEventData) => void,
  ) {
    return this._engine.events.off(`onPlayerCustomEvent_${event}`, listener);
  }

  emitToServer(event: string, data?: EventData) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

    // emit to verza
    this._messenger.emit('emitToServer', [event, data]);

    // emit local
    const customPacket: CustomPacketSendDto = {
      p: PacketDestination.Server, // PacketDestination

      e: event, // event name

      d: data, // data
    };

    // emit to server endpoint
    this._engine.api.emitPacket(PacketEvent.Custom, customPacket);
  }

  emitToPlayers(event: string, data?: EventData) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

    this._messenger.emit('emitToPlayers', [event, data]);
  }

  emitToPlayer(player: PlayerManager, event: string, data?: EventData) {
    // check packet size limit
    if (!this._checkPacketSize(data?.d)) return;

    this._messenger.emit('emitToPlayer', [player.id, event, data]);
  }

  private _checkPacketSize(data: unknown) {
    if (data && JSON.stringify(data).length >= MAX_CLIENT_OBJECT_SIZE) {
      console.debug(
        `[network] event data exceed the limit (max: ${MAX_CLIENT_OBJECT_SIZE})`,
      );
      return false;
    }

    return true;
  }
}

export default NetworkManager;
