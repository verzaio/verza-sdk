import {
  CameraModeType,
  CameraPosition,
  CameraTransition,
} from 'engine/definitions/types/camera.types';
import {toVector3Array} from 'engine/utils/vectors.utils';

import PlayerManager from './player.manager';

class PlayerCameraManager {
  private _player: PlayerManager;

  private get _messenger() {
    return this._player.messenger;
  }

  constructor(player: PlayerManager) {
    this._player = player;
  }

  private _normalizeVectors(transition: CameraTransition) {
    transition.to = toVector3Array(transition.to);

    if (transition.from) {
      transition.from = toVector3Array(transition.from);
    }

    if (transition.lookAt) {
      transition.lookAt = toVector3Array(transition.lookAt);
    }
  }

  setMode(mode: CameraModeType, instant = true) {
    this._messenger.emit('onCameraModeChange', [
      this._player.id,
      mode,
      instant,
    ]);
  }

  startTransitions(transitions: CameraTransition[]) {
    transitions.forEach(transition => {
      this._normalizeVectors(transition);
    });

    this._messenger.emit('startCameraTransitions', [
      this._player.id,
      transitions,
    ]);
  }

  startTransition(transition: CameraTransition) {
    this._normalizeVectors(transition);

    this._messenger.emit('startCameraTransition', [
      this._player.id,
      transition,
    ]);
  }

  setPosition(transition: CameraPosition) {
    this._normalizeVectors(transition);

    this._messenger.emit('setCameraPosition', [this._player.id, transition]);
  }
}

export default PlayerCameraManager;
