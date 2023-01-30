import {ObjectEntity} from 'engine/definitions/types/entities.types';
import {
  QuaternionArray,
  Vector3Array,
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

  setPosition(position: Vector3 | Vector3Array) {
    // Vector3Array
    if (Array.isArray(position)) {
      this.location.position.set(...position);
    } else {
      // Vector3
      this.location.position.copy(position);
    }

    // emit
    this._messenger.emit('setObjectPosition', [
      this.id,
      this.location.position.toArray(),
    ]);
  }

  setRotation(rotation: Quaternion | Euler | QuaternionArray | Vector3Array) {
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
    this._messenger.emit('setObjectRotation', [
      this.id,
      this.location.quaternion.toArray() as QuaternionArray,
    ]);
  }
}

export default ObjectManager;
