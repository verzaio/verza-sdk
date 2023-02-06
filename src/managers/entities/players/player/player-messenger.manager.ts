import {
  CameraModeType,
  CameraPosition,
  CameraTransition,
} from 'engine/definitions/types/camera.types';
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
    //
  }
}

export default PlayerMessengerManager;
