import {Euler, Object3D, Quaternion, Vector3} from 'three';

import {ObjectEntity} from 'engine/definitions/types/entities.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import EngineManager from 'engine/managers/engine.manager';

import EntityManager from '../../entity/entity.manager';
import ObjectHandleManager from './object-handle.manager';

const _TEMP_POS = new Vector3();
const _TEMP_POS2 = new Vector3();
const _TEMP_QUAT = new Quaternion();
const _TEMP_QUAT2 = new Quaternion();
const _TEMP_OBJECT = new Object3D();

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
    this.updatePosition(position);

    // emit
    if (this.parent) {
      this._messenger.emit('setObjectPosition', [
        this.id,
        this.location.position.toArray(),
      ]);
      return;
    }

    this._messenger.emit('setPositionFromWorldSpace', [
      this.id,
      this.location.position.toArray(),
    ]);
  }

  setRotation(rotation: Quaternion | Euler | QuaternionArray | Vector3Array) {
    this.updateRotation(rotation);

    // emit
    if (this.parent) {
      this._messenger.emit('setObjectRotation', [
        this.id,
        this.location.quaternion.toArray() as QuaternionArray,
      ]);
      return;
    }

    this._messenger.emit('setObjectRotation', [
      this.id,
      this.location.quaternion.toArray() as QuaternionArray,
    ]);
  }

  setPositionFromWorldSpace(position: Vector3 | Vector3Array) {
    if (!this.parent) {
      this.setPosition(position);
      return;
    }

    // Vector3Array
    if (Array.isArray(position)) {
      _TEMP_POS.set(...position);
    } else {
      // Vector3
      _TEMP_POS.copy(position);
    }

    this.location.parent?.getWorldPosition(_TEMP_POS2);
    _TEMP_POS.sub(_TEMP_POS2);

    this.setPosition(_TEMP_POS);
  }

  setRotationFromWorldSpace(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
  ) {
    if (!this.parent) {
      this.setRotation(rotation);
      return;
    }

    if (Array.isArray(rotation)) {
      // Vector3Array
      if (rotation.length === 3) {
        _TEMP_OBJECT.rotation.set(...rotation);
      } else {
        // QuaternionArray
        _TEMP_OBJECT.quaternion.set(...rotation);
      }
    } else {
      // Euler
      if (rotation instanceof Euler) {
        _TEMP_OBJECT.rotation.copy(rotation);
      } else {
        // Quaternion
        _TEMP_OBJECT.quaternion.copy(rotation);
      }
    }

    this.location.parent?.getWorldQuaternion(_TEMP_QUAT2);

    // conver to local-space
    _TEMP_QUAT.multiplyQuaternions(
      _TEMP_OBJECT.quaternion,
      _TEMP_QUAT2.invert(),
    );

    this.setRotation(_TEMP_QUAT);
  }

  detachFromParent() {
    if (!this.parent) return;

    this.parent.children.delete(this);
    this.parent.location.remove(this.location);
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
    parent.location.add(this.location);
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

  edit() {
    this.engine.objects.edit(this);
  }
}

export default ObjectManager;
