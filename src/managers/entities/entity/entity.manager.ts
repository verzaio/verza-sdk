import {Euler, Object3D, Quaternion, Vector3} from 'three';

import {DEFAULT_ENTITY_DRAW_DISTANCE} from 'engine/definitions/constants/streamer.constants';
import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {
  EntityDrawDistanceType,
  EntityItem,
  MergeEntityEvents,
} from 'engine/definitions/types/entities.types';
import {EntityEventMap} from 'engine/definitions/types/events.types';
import {
  EulerArray,
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {calcChunkIndex} from 'engine/utils/chunks.utils';

import EngineManager from '../../engine.manager';
import {EventListenersMap} from '../../events.manager';
import EntityEventsManager from './entity-events.manager';
import EntityHandleManager from './entity-handle.manager';
import EntityStreamManager from './entity-stream.manager';

const TEMP_POS = new Vector3();

class EntityManager<
  T extends EntityItem = EntityItem,
  H extends EntityHandleManager<any> | void = void,
  Events extends EventListenersMap | void = void,
> {
  destroyed = false;

  entity: T;

  engine: EngineManager;

  handle: H extends EntityHandleManager<any> ? H : EntityHandleManager<this> =
    null!;

  streamed = false;

  events: EntityEventsManager<MergeEntityEvents<Events, EntityEventMap<this>>> =
    null!;

  private _location = new Object3D();

  streamer: EntityStreamManager = null!;

  chunkIndex: ChunkIndex = null!;

  /* accessors */
  get id(): T['id'] {
    return this.entity.id;
  }

  get type() {
    return this.entity.type;
  }

  get data(): T['data'] {
    return this.entity.data;
  }

  set data(data: T['data']) {
    this.entity.data = data;
  }

  get worldPosition() {
    this.location.getWorldPosition(TEMP_POS);

    return TEMP_POS;
  }

  get location() {
    return this._location;
  }

  get position() {
    return this._location.position;
  }

  get rotation() {
    return this._location.quaternion;
  }

  get dimension() {
    return this.data.d ?? 0;
  }

  set dimension(dimension: number) {
    this.data.d = dimension;
  }

  get drawDistance() {
    return this.data.dd ?? DEFAULT_ENTITY_DRAW_DISTANCE;
  }

  set drawDistance(drawDistance: EntityDrawDistanceType) {
    this.data.dd = drawDistance;
  }

  constructor(entity: T, engine: EngineManager) {
    this.entity = entity;
    this.engine = engine;
  }

  restoreData() {
    // position
    if (this.data.p) {
      this.location.position.set(...this.data.p);
    }

    // rotation
    if (this.data.r) {
      // QuaternionArray
      if (this.data.r.length === 4) {
        this.location.quaternion.set(...this.data.r);
      } else {
        // Vector3Array
        this.location.rotation.set(...this.data.r);
      }
    }
  }

  updateChunkIndex() {
    this.chunkIndex = calcChunkIndex(
      this.worldPosition.x,
      this.worldPosition.y,
      this.worldPosition.z,
      this.dimension,
      this.engine.chunkSize,
    );
  }

  updatePosition(position: Vector3 | Vector3Array) {
    // Vector3Array
    if (Array.isArray(position)) {
      this.location.position.set(...position);
    } else {
      // Vector3
      this.location.position.copy(position);
    }
  }

  updateRotation(rotation: Quaternion | Euler | QuaternionArray | EulerArray) {
    if (Array.isArray(rotation)) {
      // Vector3Array
      if (rotation.length === 3) {
        this.location.rotation.set(...rotation);
      } else {
        // QuaternionArray
        this.location.quaternion.set(...rotation);
      }
    } else {
      // Euler
      if (rotation instanceof Euler) {
        this.location.rotation.copy(rotation);
      } else {
        // Quaternion
        this.location.quaternion.copy(rotation);
      }
    }
  }
}

export default EntityManager;
