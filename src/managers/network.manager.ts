import {CustomEventData} from 'engine/definitions/types/events.types';
import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';

type EventData = {
  [name: string]: unknown;
};

class NetworkManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  onPlayersEvent(
    event: string,
    listener: (player: PlayerManager, data: CustomEventData) => void,
  ) {
    const listenerWrapper = (playerId: number, data?: CustomEventData) => {
      listener(this._engine.entities.player.get(playerId), data!);
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
    this._messenger.emit('emitToServer', [event, data]);
  }

  emitToPlayers(event: string, data?: EventData) {
    this._messenger.emit('emitToPlayers', [event, data]);
  }
}

export default NetworkManager;
