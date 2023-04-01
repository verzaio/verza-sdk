import {ColorType} from 'engine/definitions/types/ui.types';

import EngineManager from '../engine.manager';
import RaycasterManager from './raycaster.manager';
import SkyManager from './sky.manager';

class WorldManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  raycaster: RaycasterManager = null!;

  sky: SkyManager = null!;

  constructor(engine: EngineManager) {
    this._engine = engine;

    if (engine.isClient) {
      this.raycaster = new RaycasterManager(engine);
      this.sky = new SkyManager(engine);
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
}

export default WorldManager;
