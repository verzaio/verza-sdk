import {FileTransfer} from '..';

import EngineManager from './engine.manager';

class AssetsManager {
  private _engine: EngineManager;

  get assetsUrl() {
    const assetsUrl = this._engine.network.server?.assets_url;
    return assetsUrl ?? '';
  }

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

  formatUrl(url: string) {
    if (url?.startsWith('asset_')) {
      return `${this.assetsUrl}/${url}`;
    }

    return url;
  }
}

export default AssetsManager;
