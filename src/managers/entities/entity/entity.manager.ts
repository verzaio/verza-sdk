import {Euler, Object3D, Quaternion, Vector3} from 'three';

import {DEFAULT_ENTITY_DRAW_DISTANCE} from 'engine/definitions/constants/streamer.constants';
import {EntityAttachOptions} from 'engine/definitions/types/attachments.types';
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
import {toQuaternionArray, toVector3Array} from 'engine/utils/vectors.utils';

import EngineManager from '../../engine.manager';
import {EventListenersMap} from '../../events.manager';
import EntityEventsManager from './entity-events.manager';
import EntityHandleManager from './entity-handle.manager';
import EntityStreamManager from './entity-stream.manager';

type ExcludedEventMethods = 'onEnter' | 'onLeave';

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

  events: EntityEventsManager<
    MergeEntityEvents<Events, Omit<EntityEventMap<this>, ExcludedEventMethods>>
  > = null!;

  attachedTo: EntityManager | null = null;

  location = new Object3D();

  private __POSITION = new Vector3();

  private __QUATERNION = new Quaternion();

  private __SCALE = new Vector3();

  attachedEntities: Set<EntityManager> = new Set();

  streamer: EntityStreamManager = null!;

  chunkIndex: ChunkIndex = null!;

  vars: Map<string, any> = new Map();

  /* accessors */
  get id(): T['id'] {
    return this.entity.id;
  }

  get type() {
    return this.entity.type;
  }

  get isObject() {
    return this.type === 'object';
  }

  get isPlayer() {
    return this.type === 'player';
  }

  get data(): T['data'] {
    return this.entity.data;
  }

  set data(data: T['data']) {
    this.entity.data = data;
  }

  get position() {
    return this.location.position;
  }

  get quaternion() {
    return this.location.quaternion;
  }

  get rotation() {
    return this.location.rotation;
  }

  get worldPosition() {
    if (!this.attachedTo) {
      this.__POSITION.copy(this.location.position);
    } else {
      this.location.matrixWorld.decompose(
        this.__POSITION,
        this.__QUATERNION,
        this.__SCALE,
      );
    }

    return this.__POSITION;
  }

  get worldQuaternion() {
    if (!this.attachedTo) {
      this.__QUATERNION.copy(this.location.quaternion);
    } else {
      this.location.matrixWorld.decompose(
        this.__POSITION,
        this.__QUATERNION,
        this.__SCALE,
      );
    }

    return this.__QUATERNION;
  }

  get worldScale() {
    if (!this.attachedTo) {
      this.__SCALE.copy(this.location.scale);
    } else {
      this.location.matrixWorld.decompose(
        this.__POSITION,
        this.__QUATERNION,
        this.__SCALE,
      );
    }

    return this.__SCALE;
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

  attach(entity: EntityManager, options: EntityAttachOptions = {}) {
    this._attach(entity, options);
  }

  detach(entity: EntityManager) {
    if (entity.attachedTo !== this) return;

    entity._detach();
  }

  detachFromParent() {
    this._detach();
  }

  /**
   * @private
   */
  _attach(
    entity: EntityManager,
    options: EntityAttachOptions = {},
    report = true,
  ) {
    if (entity.attachedTo !== this) {
      this.location.add(entity.location);
      entity.location.updateMatrixWorld();

      entity.attachedTo = this;
    }

    if (options.position) {
      options.position = toVector3Array(options.position);
    }

    if (options.rotation) {
      options.rotation = toQuaternionArray(options.rotation);
    }

    if (!report) return;

    if (this.isObject) {
      if (entity.isObject) {
        this.engine.messenger.emit('attachObjectToObject', [
          entity.id as string,
          this.id as string,
          options,
        ]);
      } else {
        this.engine.messenger.emit('attachPlayerToObject', [
          entity.id as number,
          this.id as string,
          options,
        ]);
      }
    } else {
      if (entity.isObject) {
        this.engine.messenger.emit('attachObjectToPlayer', [
          entity.id as string,
          this.id as number,
          options,
        ]);
      } else {
        this.engine.messenger.emit('attachPlayerToPlayer', [
          entity.id as number,
          this.id as number,
          options,
        ]);
      }
    }
  }

  /**
   * @private
   */
  _detach(report = true) {
    if (this.attachedTo) {
      this.location.removeFromParent();
      this.location.updateMatrixWorld();

      this.attachedTo.attachedEntities.delete(this);
      this.attachedTo = null;
    }

    if (!report) return;

    if (this.isObject) {
      this.engine.messenger.emit('detachObject', [this.id as string]);
    } else {
      this.engine.messenger.emit('detachPlayer', [this.id as number]);
    }
  }
}

export default EntityManager;
