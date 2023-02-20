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
}

export default WorldManager;