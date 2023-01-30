import {ObjectEntity} from 'engine/definitions/types/entities.types';
import {
  QuaternionArray,
  VectorArray,
} from 'engine/definitions/types/world.types';
import EngineManager from 'engine/managers/engine.manager';
import {Euler, Quaternion, Vector3} from 'three';

import EntityManager from '../../entity/entity.manager';
import ObjectHandleManager from './object-handle.manager';

class ObjectManager extends EntityManager<ObjectEntity, ObjectHandleManager> {
  /* getter & setters */
  get location() {
    return super.location;
  }

  get position() {
    return super.location.position;
  }

  get rotation() {
    return super.location.quaternion;
  }

  private get _messenger() {
    return this.engine.messenger;
  }

  constructor(entity: ObjectEntity, engine: EngineManager) {
    super(entity, engine);

    // restore position
    this.restorePosition();
  }

  setPosition(position: Vector3 | VectorArray) {
    // VectorArray
    if (Array.isArray(position)) {
      this.location.position.set(...position);
      this._messenger.emit('setObjectPosition', [this.id, position]);
      return;
    }

    // Vector3
    this.location.position.copy(position);
    this._messenger.emit('setObjectPosition', [
      this.id,
      this.location.position.toArray(),
    ]);
  }

  setRotation(rotation: Quaternion | Euler | QuaternionArray | VectorArray) {
    if (Array.isArray(rotation)) {
      // VectorArray
      if (rotation.length === 3) {
        this.location.rotation.set(...rotation);
        this._messenger.emit('setObjectRotation', [this.id, rotation]);
        return;
      }

      // QuaternionArray
      this.location.quaternion.set(...rotation);
      this._messenger.emit('setObjectRotation', [this.id, rotation]);
      return;
    }

    // Euler
    if (rotation instanceof Euler) {
      this.location.rotation.copy(rotation);
      this._messenger.emit('setObjectRotation', [
        this.id,
        [rotation.x, rotation.y, rotation.z],
      ]);
      return;
    }

    // Quaternion
    this.location.quaternion.copy(rotation);
    this._messenger.emit('setObjectRotation', [
      this.id,
      [rotation.x, rotation.y, rotation.z, rotation.w],
    ]);
  }
}

export default ObjectManager;
