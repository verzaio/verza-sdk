import {v4} from 'uuid';

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
    this._messenger.emit('setInteriorMode', [status]);
  }

  setHemisphereLightColor(color: ColorType) {
    this._messenger.emit('setHemisphereLightColor', [color]);
  }

  setHemisphereLightGroundColor(color: ColorType) {
    this._messenger.emit('setHemisphereLightGroundColor', [color]);
  }

  setHemisphereLightIntensity(intensity: number) {
    this._messenger.emit('setHemisphereLightIntensity', [intensity]);
  }

  setGlobalLightColor(color: ColorType) {
    this._messenger.emit('setGlobalLightColor', [color]);
  }

  setGlobalLightIntensity(intensity: number) {
    this._messenger.emit('setGlobalLightIntensity', [intensity]);
  }

  /* time */
  setTime(seconds: number) {
    this._messenger.emit('setTime', [seconds]);
  }

  getTime() {
    return this._messenger.emitAsync('getTime');
  }

  setTimeRepresentation(hour: number, minute = 0, second = 0) {
    this._messenger.emit('setTime', [
      Math.max(0, Math.min(hour * 3600 + minute * 60 + second, 86400)),
    ]);
  }

  setTimeMode(timeMode: TimeMode) {
    this._messenger.emit('setTimeMode', [timeMode]);
  }

  setTimeCycleDuration(timeCycleDuration: number) {
    this._messenger.emit('setTimeCycleDuration', [timeCycleDuration]);
  }

  setTimezone(timezone: Timezone) {
    this._messenger.emit('setTimezone', [timezone]);
  }

  /* sky */
  setWeather(weather: WeatherType) {
    this._messenger.emit('setWeather', [weather]);
  }

  setFogStatus(status: boolean) {
    this._messenger.emit('setFogStatus', [status]);
  }

  setFogColor(color: ColorType) {
    this._messenger.emit('setFogColor', [color]);
  }

  setFogDensity(density: number) {
    this._messenger.emit('setFogDensity', [density]);
  }

  setSkybox(skybox: SkyboxProps | string | null) {
    this._messenger.emit('setSkybox', [skybox]);
  }

  setMoonPhase(phase: MoonPhases) {
    this._messenger.emit('setMoonPhase', [phase]);
  }

  setSkyManualMode(status: boolean) {
    this._messenger.emit('setSkyManualMode', [status]);
  }

  setViewportRender(type: ViewportRender) {
    this._messenger.emit('setViewportRender', [type]);
  }

  createProximityAction(action: Partial<ProximityAction>): string {
    if (action.position) {
      action.position = toVector3Array(action.position);
    }

    if (!action.id) {
      action.id = v4();
    }

    this._messenger.emit('createProximityAction', [action as ProximityAction]);

    return action.id;
  }

  deleteProximityAction(actionId: string) {
    this._messenger.emit('deleteProximityAction', [actionId]);
  }
}

export default WorldManager;
