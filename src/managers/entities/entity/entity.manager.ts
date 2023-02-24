import {Euler, Object3D, Quaternion, Vector3} from 'three';

import {DEFAULT_ENTITY_DRAW_DISTANCE} from 'engine/definitions/constants/streamer.constants';
import {
  EntityDrawDistance,
  EntityItem,
  MergeEntityEvents,
} from 'engine/definitions/types/entities.types';
import {EntityEventMap} from 'engine/definitions/types/events.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';

import EngineManager from '../../engine.manager';
import EventsManager, {EventListenersMap} from '../../events.manager';
import EntityHandleManager from './entity-handle.manager';
import EntityStreamManager from './entity-stream.manager';

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

  events: EventsManager<MergeEntityEvents<Events, EntityEventMap<this>>> =
    null!;

  private _location = new Object3D();

  streamer: EntityStreamManager = null!;

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

  set drawDistance(drawDistance: EntityDrawDistance) {
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

  updatePosition(position: Vector3 | Vector3Array) {
    // Vector3Array
    if (Array.isArray(position)) {
      this.location.position.set(...position);
    } else {
      // Vector3
      this.location.position.copy(position);
    }
  }

  updateRotation(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
  ) {
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
