import {ColorType} from 'engine/definitions/types/ui.types';
import {
  MoonPhases,
  ProximityAction,
  SkyboxProps,
  TimeMode,
  Timezone,
  ViewportRender,
  WeatherType,
} from 'engine/definitions/types/world.types';
import {toVector3Array} from 'engine/utils/vectors.utils';

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
    //
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
    this._engine.messenger.emit('setTime', [
      Math.max(0, Math.min(hour * 3600 + minute * 60 + second, 86400)),
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

  setViewportRender(type: ViewportRender) {
    this._engine.messenger.emit('setViewportRender', [type]);
  }

  createProximityAction(action: ProximityAction) {
    if (action.position) {
      action.position = toVector3Array(action.position);
    }

    this._engine.messenger.emit('createProximityAction', [action]);
  }

  deleteProximityAction(actionId: string) {
    this._engine.messenger.emit('deleteProximityAction', [actionId]);
  }
}

export default WorldManager;
