import {Vector3} from 'three';

import {
  IntersectsResult,
  IntersectsResultRaw,
  RaycastOptions,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {toVector3Array} from 'engine/utils/vectors.utils';

import EngineManager from '../engine.manager';

class RaycasterManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async raycastScreenPoint(
    x: number,
    y: number,
    far: number | null,
    options: RaycastOptions = {},
  ) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastScreenPoint', [
      x,
      y,
      far,
      options,
    ]);

    return this.parseIntersectsResult(intersects);
  }

  async raycastPoint(
    origin: Vector3 | Vector3Array,
    dir: Vector3 | Vector3Array,
    far: number | null,
    options: RaycastOptions = {},
  ) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastPoint', [
      toVector3Array(origin),
      toVector3Array(dir),
      far,
      options,
    ]);

    return this.parseIntersectsResult(intersects);
  }

  async raycastPoints(
    from: Vector3 | Vector3Array,
    to: Vector3 | Vector3Array,
    options: RaycastOptions = {},
  ) {
    const {
      data: [intersects],
    } = await this._messenger.emitAsync('raycastPoints', [
      toVector3Array(from),
      toVector3Array(to),
      options,
    ]);

    return this.parseIntersectsResult(intersects);
  }

  parseIntersectsResult(intersects: IntersectsResultRaw): IntersectsResult {
    const result: IntersectsResult = {};

    // hit
    if (intersects.hit) {
      result.hit = intersects.hit;
    }

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
