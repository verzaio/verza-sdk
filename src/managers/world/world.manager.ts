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
}

export default WorldManager;
