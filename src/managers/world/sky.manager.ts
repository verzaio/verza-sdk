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

  setHemisphereLight(color: string, groundColor: string, intensity = 1) {
    this._engine.messenger.emit('setHemisphereLight', [
      color,
      groundColor,
      intensity,
    ]);
  }

  setLight(color: string, intensity = 1) {
    this._engine.messenger.emit('setLight', [color, intensity]);
  }
}

export default SkyManager;
