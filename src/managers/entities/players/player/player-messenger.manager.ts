import {ScriptEventMap} from 'engine/definitions/types/scripts.types';

import PlayerManager from './player.manager';

class PlayerMessengerManager {
  private _player: PlayerManager;

  constructor(player: PlayerManager) {
    this._player = player;
  }

  async emit<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
  ) {
    await this._player.engine.api.emitAction(eventName, args);
  }

  async emitAsync<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
  ) {
    return this._player.engine.api.emitActionAsync(eventName, args);
  }
}

export default PlayerMessengerManager;
