import EngineManager from './engine.manager';

export type MoonPhases =
  | 'newMoon'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'fullMoon'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

class SkyManager {
  private _engine: EngineManager;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  setMoonPhase(phase: MoonPhases) {
    this._engine.messenger.emit('setMoonPhase', [phase]);
  }

  setTime(time: number) {
    this._engine.messenger.emit('setTime', [time]);
  }

  setTimeRepresentation(hours: number, minutes = 0, seconds = 0) {
    this._engine.messenger.emit('setTimeRepresentation', [
      hours,
      minutes,
      seconds,
    ]);
  }

  setHemisphereLight(color: string, groundColor: string, intensity = 0) {
    this._engine.messenger.emit('setHemisphereLight', [
      color,
      groundColor,
      intensity,
    ]);
  }

  setLight(color: string, intensity: number) {
    this._engine.messenger.emit('setLight', [color, intensity]);
  }
}

export default SkyManager;
