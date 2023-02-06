import {
  CameraModeType,
  CameraPosition,
  CameraTransition,
} from 'engine/definitions/types/camera.types';
import {Vector3} from 'three';
import PlayerManager from './player.manager';

class PlayerCameraManager {
  private _player: PlayerManager;

  private get _messenger() {
    return this._player.messenger;
  }

  constructor(player: PlayerManager) {
    this._player = player;
  }

  private _normalizePosition(transition: CameraTransition) {
    if (transition.to instanceof Vector3) {
      transition.to = transition.to.toArray();
    }

    if (transition.from instanceof Vector3) {
      transition.from = transition.from.toArray();
    }

    if (transition.lookAt instanceof Vector3) {
      transition.lookAt = transition.lookAt.toArray();
    }
  }

  setMode(mode: CameraModeType, instant = true) {
    this._messenger.emit('onCameraModeChange', [
      this._player.id,
      mode,
      instant,
    ]);
  }

  setTransitions(transitions: CameraTransition[]) {
    transitions.forEach(transition => {
      this._normalizePosition(transition);
    });

    this._messenger.emit('setCameraTransitions', [
      this._player.id,
      transitions,
    ]);
  }

  setTransition(transition: CameraTransition) {
    this._normalizePosition(transition);

    this._messenger.emit('setCameraTransition', [this._player.id, transition]);
  }

  setPosition(transition: CameraPosition) {
    this._normalizePosition(transition);

    this._messenger.emit('setCameraPosition', [this._player.id, transition]);
  }
}

export default PlayerCameraManager;
