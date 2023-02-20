import {Vector3} from 'three';

import {
  IntersectsResult,
  IntersectsResultRaw,
  RaycastOptions,
} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';

class RaycasterManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async raycastFromCursor(x: number, y: number, options: RaycastOptions = {}) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastFromCursor', [x, y, options]);

    return this.parseIntersectsResult(intersects);
  }

  async raycastFromPoints(
    from: Vector3,
    to: Vector3,
    options: RaycastOptions = {},
  ) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastFromPoints', [
      from.toArray(),
      to.toArray(),
      options,
    ]);

    return this.parseIntersectsResult(intersects);
  }

  async raycastFromPoint(
    origin: Vector3,
    dir: Vector3,
    far: number | null,
    options: RaycastOptions = {},
  ) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastFromPoint', [
      origin.toArray(),
      dir.toArray(),
      far,
      options,
    ]);

    return this.parseIntersectsResult(intersects);
  }

  parseIntersectsResult(intersects: IntersectsResultRaw): IntersectsResult {
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

    return result;
  }
}

export default RaycasterManager;
