import {DRACOLoader, GLTFLoader} from 'three-stdlib';

import {DRACO_URL} from 'engine/definitions/local/constants/engine.constants';

import EngineManager from './engine.manager';

class UtilsManager {
  private _engine: EngineManager;

  gltfLoader = new GLTFLoader();

  constructor(engine: EngineManager) {
    this._engine = engine;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_URL);
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }
}

export default UtilsManager;
