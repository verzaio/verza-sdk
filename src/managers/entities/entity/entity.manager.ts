import {startTransition} from 'react';

import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {
  EntityDrawDistance,
  EntityItem,
  MergeEntityEvents,
} from 'engine/definitions/types/entities.types';
import {EntityEventMap} from 'engine/definitions/types/events.types';
import {Object3D} from 'three';

import EngineManager from '../../engine.manager';
import EventsManager, {EventListenersMap} from '../../events.manager';
import EntityHandleManager from './entity-handle.manager';
import {DEFAULT_ENTITY_DRAW_DISTANCE} from 'engine/definitions/constants/streamer.constants';

class EntityManager<
  T extends EntityItem = EntityItem,
  H extends EntityHandleManager<any> | void = void,
  Events extends EventListenersMap | void = void,
> {
  entity: T;

  engine: EngineManager;

  handle: H extends EntityHandleManager<any> ? H : EntityHandleManager<this> =
    null!;

  streamed = false;

  events: EventsManager<MergeEntityEvents<Events, EntityEventMap<this>>> =
    null!;

  private _location = new Object3D();

  /* accessors */
  get id(): T['id'] {
    return this.entity.id;
  }

  get type() {
    return this.entity.type;
  }

  get data(): T['data'] {
    return this.entity.data ?? {};
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

  // TODO: Implement
  get dimension() {
    return 0;
  }

  drawDistance: EntityDrawDistance = DEFAULT_ENTITY_DRAW_DISTANCE;

  constructor(entity: T, engine: EngineManager) {
    this.entity = entity;
    this.engine = engine;
  }

  restorePosition() {
    startTransition(() => {
      // set draw distance
      if (this.data?.m?.d) {
        this.drawDistance = this.data.m.d;
      }

      // world position | WorldPosition
      if (this.data.p?.p) {
        this.location.position.set(
          this.data.p.p[0], // x
          this.data.p.p[1], // y
          this.data.p.p[2], // z
        );

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
      }

      // position
      if (this.data.position) {
        this.location.position.set(...this.data.position);
      }

      // rotation
      if (this.data.rotation) {
        this.location.quaternion.set(...this.data.rotation);
      }
    });
  }
}

export default EntityManager;
