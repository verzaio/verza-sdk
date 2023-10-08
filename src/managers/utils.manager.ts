import type {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import {DRACO_URL} from 'engine/definitions/local/constants/engine.constants';

class UtilsManager {
  gltfLoader: GLTFLoader = new GLTFLoader();

  private _dracoLoader: DRACOLoader = null!;

  async setupGltfLoaders() {
    if (this._dracoLoader) return;

    const {MeshoptDecoder} = await import(
      'three/examples/jsm/libs/meshopt_decoder.module.js'
    );

    const {DRACOLoader} = await import(
      'three/examples/jsm/loaders/DRACOLoader.js'
    );

    if (this._dracoLoader) return;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_URL);
    this.gltfLoader.setDRACOLoader(dracoLoader);

    // meshopt
    this.gltfLoader.setMeshoptDecoder(MeshoptDecoder);

    // DRACO
    this._dracoLoader = new DRACOLoader();
    this._dracoLoader.setDecoderPath(DRACO_URL);
    this.gltfLoader.setDRACOLoader(this._dracoLoader);

    // ktx2
    //this.ktx2Loader = new KTX2Loader()
    //.setTranscoderPath(enginePath('libs/basis/'));
    //this.gltfLoader.setKTX2Loader(this.ktx2Loader);
  }

  destroy() {
    this._dracoLoader?.dispose();
  }
}

export default UtilsManager;
