import {IntersectsResult} from 'engine/definitions/types/world.types';

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
      const result: IntersectsResult = {};

      // object
      if (intersects.object) {
        const entity = this._engine.objects.ensure(
          intersects.object.entity,
          intersects.object.data,
        );

        result.object = {
          ...intersects.object,
          entity,
        };
      }

      // player
      if (intersects.player) {
        const entity = this._engine.players.get(intersects.player.entity);
        result.player = {
          ...intersects.player,
          entity,
        };
      }

      // emit
      this._engine.events.emit('onEntitySelected', result);
    });
  }

  setEntitySelector(status: boolean) {
    this._messenger.emit('setEntitySelector', [status]);
  }
}

export default WorldManager;
