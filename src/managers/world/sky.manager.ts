import {MoonPhases} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';

class SkyManager {
  private _engine: EngineManager;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  setMoonPhase(phase: MoonPhases) {
    this._engine.messenger.emit('setMoonPhase', [phase]);
  }

  setSkyManualMode(status: boolean) {
    this._engine.messenger.emit('setSkyManualMode', [status]);
  }
}

export default SkyManager;
