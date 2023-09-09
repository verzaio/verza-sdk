import {ColorType} from 'engine/definitions/types/ui.types';
import {
  MoonPhases,
  ProximityActionOptions,
  SkyboxProps,
  TimeMode,
  Timezone,
  ViewportRender,
  WeatherType,
} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';
import ObjectManager from '../entities/objects/object/object.manager';
import PlayerManager from '../entities/players/player/player.manager';
import ProximityActionManager from './proximity-action.manager';
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
  setInteriorModeEnabled(enabled: boolean) {
    this._messenger.emit('setInteriorModeEnabled', [enabled]);
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

  setGlobalLightAzimuth(azimuth: number) {
    this._messenger.emit('setGlobalLightAzimuth', [azimuth]);
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

  setFogEnabled(status: boolean) {
    this._messenger.emit('setFogEnabled', [status]);
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

  setSkyManualModeEnabled(status: boolean) {
    this._messenger.emit('setSkyManualModeEnabled', [status]);
  }

  setViewportRender(type: ViewportRender) {
    this._messenger.emit('setViewportRender', [type]);
  }

  createProximityAction(
    options: ProximityActionOptions = {},
    withId?: string,
  ): ProximityActionManager {
    return new ProximityActionManager(this._engine, options, withId);
  }

  createPlayerProximityAction(
    player: number | PlayerManager,
    options: ProximityActionOptions = {},
    withId?: string,
  ): ProximityActionManager {
    return new ProximityActionManager(
      this._engine,
      options,
      withId,
      undefined,
      typeof player === 'number' ? player : player.id,
    );
  }

  createObjectProximityAction(
    object: string | ObjectManager,
    options: ProximityActionOptions = {},
    withId?: string,
  ): ProximityActionManager {
    return new ProximityActionManager(
      this._engine,
      options,
      withId,
      typeof object === 'string' ? object : object.id,
    );
  }
}

export default WorldManager;
