import {Vector3} from 'three';

import {
  CameraModeType,
  CameraPosition,
  CameraTransition,
} from 'engine/definitions/types/camera.types';

import EngineManager from './engine.manager';

class CameraManager {
  private _engine: EngineManager;

  mode: CameraModeType = 'world';

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  setMode(mode: CameraModeType, instant = true) {
    this.mode = mode;

    this._messenger.emit('onCameraModeChange', [mode, instant]);
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

  setTransitions(transitions: CameraTransition[]) {
    transitions.forEach(transition => {
      this._normalizePosition(transition);
    });

    this._messenger.emit('setCameraTransitions', [transitions]);
  }

  setTransition(transition: CameraTransition) {
    this._normalizePosition(transition);

    this._messenger.emit('setCameraTransition', [transition]);
  }

  setPosition(transition: CameraPosition) {
    this._normalizePosition(transition);

    this._messenger.emit('setCameraPosition', [transition]);
  }
}

export default CameraManager;
