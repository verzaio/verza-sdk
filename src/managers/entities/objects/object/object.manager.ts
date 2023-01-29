import {ObjectEntity} from 'engine/definitions/types/entities.types';
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

  constructor(entity: ObjectEntity, engine: EngineManager) {
    super(entity, engine);
  }

  setPosition(position: Vector3, instant = true) {
    //
  }

  setRotation(rotation: Quaternion | Euler, instant = true) {
    //
  }
}

export default ObjectManager;
