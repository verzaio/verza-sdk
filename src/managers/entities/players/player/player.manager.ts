import {PlayerEntity} from 'engine/definitions/types/entities.types';
import {PlayerEventMap} from 'engine/definitions/types/events.types';
import EngineManager from 'engine/managers/engine.manager';
import {Euler, Quaternion, Vector3} from 'three';

import EntityManager from '../../entity/entity.manager';
import type PlayerHandleManager from './player-handle.manager';

class PlayerManager extends EntityManager<
  PlayerEntity,
  PlayerHandleManager,
  PlayerEventMap
> {
  /* accessors */
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
    //
  }

  setPosition(position: Vector3, instant = true) {
    //
  }

  setRotation(rotation: Quaternion | Euler, instant = true) {
    //
  }

  getFacingAngle() {
    //
  }

  setFacingAngle(degrees: number, instant = true) {
    //
  }

  setCameraBehind() {
    //
  }
}

export default PlayerManager;
