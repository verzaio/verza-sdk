import {VoicechatModeType} from 'engine/definitions/types/voicechat.types';

import EngineManager from './engine.manager';

class VoicechatManager {
  private _engine: EngineManager;

  private get _api() {
    return this._engine.api;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  setEnabled(status: boolean) {
    this._api.emitAction('setVoicechatEnabled', [status]);
  }

  setMode(mode: VoicechatModeType) {
    this._api.emitAction('setVoicechatMode', [mode]);
  }

  async setDistance(distance: number): Promise<void> {
    await this._api.emitAction('setVoicechatDistance', [distance]);
  }
}

export default VoicechatManager;
