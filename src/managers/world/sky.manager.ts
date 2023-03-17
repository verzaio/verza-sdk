import {MoonPhases} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';

class SkyManager {
  private _engine: EngineManager;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  setTimeRepresentation(hours: number, minutes = 0, seconds = 0) {
    this._engine.messenger.emit('setTimeRepresentation', [
      hours,
      minutes,
      seconds,
    ]);
  }
  setTime(seconds: number) {
    this._engine.messenger.emit('setTime', [seconds]);
  }

  setMoonPhase(phase: MoonPhases) {
    this._engine.messenger.emit('setMoonPhase', [phase]);
  }

  setHemisphereLightColor(color: string) {
    this._engine.messenger.emit('setHemisphereLightColor', [color]);
  }

  setHemisphereLightGroundColor(color: string) {
    this._engine.messenger.emit('setHemisphereLightGroundColor', [color]);
  }

  setHemisphereLightIntensity(intensity: number) {
    this._engine.messenger.emit('setHemisphereLightIntensity', [intensity]);
  }

  setGlobalLightColor(color: string) {
    this._engine.messenger.emit('setGlobalLightColor', [color]);
  }

  setGlobalLightIntensity(intensity: number) {
    this._engine.messenger.emit('setGlobalLightIntensity', [intensity]);
  }

  setSkyManualMode(status: boolean) {
    this._engine.messenger.emit('setSkyManualMode', [status]);
  }
}

export default SkyManager;
