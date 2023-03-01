import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import EngineManager from 'engine/managers/engine.manager';

class MessengerEmitterManager {
  private _engine: EngineManager;

  get events() {
    return this._engine.messenger.events;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async emit<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
    playerId?: number,
  ) {
    if (this._engine.isClient) {
      this._engine.messenger.emit(eventName, args);
      return;
    }

    await this._engine.api.emitAction(eventName, args, playerId);
  }

  async emitAsync<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
    playerId?: number,
  ) {
    if (this._engine.isClient) {
      return this._engine.messenger.emitAsync(eventName, args);
    }

    return this._engine.api.emitActionAsync(eventName, args, playerId);
  }
}

export default MessengerEmitterManager;
