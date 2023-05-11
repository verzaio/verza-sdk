import {ColorType} from 'engine/definitions/types/ui.types';
import {
  MoonPhases,
  SkyboxProps,
  TimeMode,
  Timezone,
  WeatherType,
} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';
import RaycasterManager from './raycaster.manager';

class WorldManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  raycaster: RaycasterManager = null!;

  constructor(engine: EngineManager) {
    this._engine = engine;

    if (engine.isClient) {
      this.raycaster = new RaycasterManager(engine);
    }
  }

  bind() {
    this._messenger.events.on('onEntitySelectedRaw', ({data: [intersects]}) => {
      // emit
      this._engine.events.emit(
        'onEntitySelected',
        this.raycaster.parseIntersectsResult(intersects),
      );
    });
  }

  setEntitySelector(status: boolean) {
    this._messenger.emit('setEntitySelector', [status]);
  }

  /* light */
  setInteriorMode(status: boolean) {
    this._engine.messenger.emit('setInteriorMode', [status]);
  }

  setHemisphereLightColor(color: ColorType) {
    this._engine.messenger.emit('setHemisphereLightColor', [color]);
  }

  setHemisphereLightGroundColor(color: ColorType) {
    this._engine.messenger.emit('setHemisphereLightGroundColor', [color]);
  }

  setHemisphereLightIntensity(intensity: number) {
    this._engine.messenger.emit('setHemisphereLightIntensity', [intensity]);
  }

  setGlobalLightColor(color: ColorType) {
    this._engine.messenger.emit('setGlobalLightColor', [color]);
  }

  setGlobalLightIntensity(intensity: number) {
    this._engine.messenger.emit('setGlobalLightIntensity', [intensity]);
  }

  /* time */
  setTime(seconds: number) {
    this._engine.messenger.emit('setTime', [seconds]);
  }

  getTime() {
    return this._engine.messenger.emitAsync('getTime');
  }

  setTimeRepresentation(hour: number, minute = 0, second = 0) {
    this._engine.messenger.emit('setTimeRepresentation', [
      hour,
      minute,
      second,
    ]);
  }

  setTimeMode(timeMode: TimeMode) {
    this._engine.messenger.emit('setTimeMode', [timeMode]);
  }

  setTimeCycleDuration(timeCycleDuration: number) {
    this._engine.messenger.emit('setTimeCycleDuration', [timeCycleDuration]);
  }

  setTimezone(timezone: Timezone) {
    this._engine.messenger.emit('setTimezone', [timezone]);
  }

  /* sky */
  setWeather(weather: WeatherType) {
    this._engine.messenger.emit('setWeather', [weather]);
  }

  setSkybox(skybox: SkyboxProps | string | null) {
    this._engine.messenger.emit('setSkybox', [skybox]);
  }

  setMoonPhase(phase: MoonPhases) {
    this._engine.messenger.emit('setMoonPhase', [phase]);
  }

  setSkyManualMode(status: boolean) {
    this._engine.messenger.emit('setSkyManualMode', [status]);
  }
}

export default WorldManager;
