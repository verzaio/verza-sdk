import {PlayerEntity} from 'engine/definitions/types/entities.types';
import {PlayerEventMap} from 'engine/definitions/types/events.types';
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

  setPosition(position: Vector3, instant = true) {
    // update
    this.location.position.copy(position);

    // emit
    this._messenger.emit('setPlayerPosition', [
      this.id,
      position.toArray(),
      instant,
    ]);
  }

  setRotation(rotation: Quaternion | Euler, instant = true) {
    // update
    if (rotation instanceof Euler) {
      this.location.rotation.copy(rotation);
    } else {
      this.location.quaternion.copy(rotation);
    }

    // emit
    this._messenger.emit('setPlayerRotation', [
      this.id,
      rotation instanceof Euler
        ? [rotation.x, rotation.y, rotation.z]
        : [rotation.x, rotation.y, rotation.z, rotation.w],
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
