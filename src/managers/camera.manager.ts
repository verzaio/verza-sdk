import {PerspectiveCamera} from 'three';

import EngineManager from './engine.manager';

class CameraManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  camera = new PerspectiveCamera();

  get position() {
    return this.camera.position;
  }

  get rotation() {
    return this.camera.rotation;
  }

  get quaternion() {
    return this.camera.quaternion;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    if (this._engine.syncCameraPosition) {
      this._messenger.events.on('OCU', ({data: [position, quaternion]}) => {
        this.camera.position.set(...position);
        this.camera.quaternion.set(...quaternion);
      });
    }
  }
}

export default CameraManager;
