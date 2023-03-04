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

  setTime(seconds: number) {
    this._engine.messenger.emit('setTime', [seconds]);
  }

  setTimeRepresentation(hour: number, minute = 0, second = 0) {
    this._engine.messenger.emit('setTimeRepresentation', [
      hour,
      minute,
      second,
    ]);
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
