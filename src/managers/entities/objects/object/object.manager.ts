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
  parent: ObjectManager | null = null;

  children: Set<ObjectManager> = new Set();

  /* getter & setters */
  get objectType() {
    return this.data.t;
  }

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

  private get _parentId() {
    return this.data.parent_id;
  }

  constructor(entity: ObjectEntity, engine: EngineManager) {
    super(entity, engine);

    // restore position
    this.restoreData();

    // check for children
    this._checkForChildren();

    // check for parent via data.parent_id
    if (this._parentId) {
      this._attachToParent(this.engine.objects.get(this._parentId));

      // check if added
      if (this.parent) {
        return;
      }
    }
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

  detachFromParent() {
    if (!this.parent) return;

    this.parent.children.delete(this);
    this.parent = null!;
  }

  private _attachToParent(parent: ObjectManager) {
    if (!parent) {
      console.debug(
        `[objects:script] no parent found (parent id: ${this._parentId} | object id: ${this.id}:${this.objectType})`,
      );
      return;
    }

    if (parent.objectType !== 'group') {
      console.debug(
        `[objects:script] only groups can have children (parent id: ${this._parentId}:${parent?.objectType} | object id ${this.id}:${this.objectType})`,
      );
      return;
    }

    this.parent = parent;
    parent.children.add(this);
  }

  private _checkForChildren() {
    if (this.objectType !== 'group') return;

    this.data.m?.group?.c?.forEach(item => {
      const data = item.m?.[item.t];

      if (data) {
        // set parent id
        (item as ObjectEntity['data']).parent_id = this.id;

        this.engine.objects.create(item.t, item as ObjectEntity['data']);
      }
    });
  }
}

export default ObjectManager;
