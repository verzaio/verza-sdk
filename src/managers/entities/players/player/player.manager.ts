import {PlayerEntity} from 'engine/definitions/types/entities.types';
import {PlayerEventMap} from 'engine/definitions/types/events.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import EngineManager from 'engine/managers/engine.manager';
import {Euler, Quaternion, Vector3} from 'three';
import {degToRad, radToDeg} from 'three/src/math/MathUtils';

import EntityManager from '../../entity/entity.manager';
import type PlayerHandleManager from './player-handle.manager';

class PlayerManager extends EntityManager<
  PlayerEntity,
  PlayerHandleManager,
  PlayerEventMap
> {
  /* accessors */
  private get _messenger() {
    return this.engine.messenger;
  }

  get name() {
    return this.data.name ?? `Player ${this.id}`;
  }

  get onGround() {
    return this.handle?.onGround;
  }

  get state() {
    return this.handle?.state;
  }

  get isControlling() {
    return !!this.data?.controls;
  }

  get velocity() {
    return this.handle.velocity;
  }

  constructor(entity: PlayerEntity, engine: EngineManager) {
    super(entity, engine);
  }

  setName(name: string) {
    this._messenger.emit('setPlayerName', [this.id, name]);
  }

  setPosition(position: Vector3 | Vector3Array, instant = true) {
    // Vector3Array
    if (Array.isArray(position)) {
      this.location.position.set(...position);
    } else {
      // Vector3
      this.location.position.copy(position);
    }

    // emit
    this._messenger.emit('setPlayerPosition', [
      this.id,
      this.location.position.toArray(),
      instant,
    ]);
  }

  setRotation(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
    instant = true,
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

    // emit
    this._messenger.emit('setPlayerRotation', [
      this.id,
      this.location.quaternion.toArray() as QuaternionArray,
      instant,
    ]);
  }

  getFacingAngle() {
    return radToDeg(this.location.rotation.y);
  }

  setFacingAngle(degrees: number, instant = true) {
    // update
    this.location.rotation.y = degToRad(degrees);

    // emit
    this._messenger.emit('setPlayerFacingAngle', [this.id, degrees, instant]);
  }

  setCameraBehind() {
    this._messenger.emit('setPlayerCameraBehind', [this.id]);
  }
}

export default PlayerManager;
