import {FileTransfer} from '..';

import EngineManager from './engine.manager';

class AssetsManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async upload(file: FileTransfer) {
    const {
      data: [assetId],
    } = await this._engine.messenger.emitAsync('uploadAsset', [file]);

    return assetId;
  }
}

export default AssetsManager;
