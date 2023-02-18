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
    return this.data.dimension ?? 0;
  }

  set dimension(dimension: number) {
    this.data.dimension = dimension;
  }

  get drawDistance() {
    return this.data.m?.d ?? DEFAULT_ENTITY_DRAW_DISTANCE;
  }

  set drawDistance(drawDistance: EntityDrawDistance) {
    if (!this.data.m) {
      this.data.m = {d: drawDistance};
      return;
    }

    this.data.m.d = drawDistance;
  }

  constructor(entity: T, engine: EngineManager) {
    this.entity = entity;
    this.engine = engine;
  }

  restoreData() {
    // set metadata
    if (!this.data.m) {
      this.data.m = {};
    }

    // set dimension
    if (this.data.dimension === undefined) {
      this.data.dimension = 0;
    }

    // set draw distance from data.drawDistance
    if (this.data.drawDistance) {
      this.data.m.d = this.data.drawDistance;
      delete this.data.drawDistance; // delete
    }

    // world position | WorldPosition
    if (this.data.p?.p) {
      this.location.position.set(
        this.data.p.p[0], // x
        this.data.p.p[1], // y
        this.data.p.p[2], // z
      );

      // dimension
      if (this.data.p.p[3] !== undefined) {
        this.data.dimension = this.data.p.p[3];
      }

      // rotation as quaternion
      if (this.data.p.p[7] !== undefined) {
        this.location.quaternion.set(
          this.data.p.p[4], // rx
          this.data.p.p[5], // ry
          this.data.p.p[6], // rz
          this.data.p.p[7], // rw
        );
      } else {
        // rotation as euler
        if (this.data.p.p[4] !== undefined) {
          this.location.rotation.set(
            this.data.p.p[4], // rx
            this.data.p.p[5], // ry
            this.data.p.p[6], // rz
          );
        }
      }

      delete this.data.p; // delete
    }

    // position
    if (this.data.position) {
      this.location.position.set(...this.data.position);
      delete this.data.position; // delete
    }

    // rotation
    if (this.data.rotation) {
      // QuaternionArray
      if (this.data.rotation.length === 4) {
        this.location.quaternion.set(...this.data.rotation);
      } else {
        // Vector3Array
        this.location.rotation.set(...this.data.rotation);
      }
      delete this.data.rotation; // delete
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
