import {Box3, Euler, Object3D, Quaternion, Vector3} from 'three';

import {ObjectEventMap} from 'engine/definitions/local/types/events.types';
import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {ObjectEntity} from 'engine/definitions/types/entities.types';
import {
  ObjectGroupType,
  PickObject,
} from 'engine/definitions/types/objects/objects-definition.types';
import {
  ObjectDataProps,
  ObjectType,
} from 'engine/definitions/types/objects/objects.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import EngineManager from 'engine/managers/engine.manager';
import MessengerEmitterManager from 'engine/managers/messenger-emitter.manager';

import EntityManager from '../../entity/entity.manager';
import ObjectHandleManager from './object-handle.manager';

const _TEMP_POS = new Vector3();
const _TEMP_POS2 = new Vector3();
const _TEMP_POS3 = new Vector3();

const _TEMP_QUAT = new Quaternion();
const _TEMP_QUAT2 = new Quaternion();

const _TEMP_OBJECT = new Object3D();

class ObjectManager extends EntityManager<
  ObjectEntity,
  ObjectHandleManager,
  ObjectEventMap
> {
  parent: ObjectManager | null = null;

  children: Set<ObjectManager> = new Set();

  boundingBox: Box3 = null!;

  isController = false;

  private _messenger: MessengerEmitterManager;

  private _worldLocation: Object3D = null!;

  /* getter & setters */
  get objectType() {
    return this.data.t;
  }

  get worldLocation() {
    return (async () => {
      if (!this._worldLocation) {
        this._worldLocation = new Object3D();
      }

      const parent = await this.resolveParent();

      if (parent) {
        this.location.getWorldPosition(this._worldLocation.position);
        this.location.getWorldQuaternion(this._worldLocation.quaternion);
      } else {
        this._worldLocation.position.copy(this.location.position);
        this._worldLocation.quaternion.copy(this.location.quaternion);
      }

      // scale
      this._worldLocation.scale.copy(this.location.scale);

      return this._worldLocation;
    })();
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

  get scale() {
    return super.location.scale;
  }

  get permanent() {
    if (this.parent) {
      return this.parent.permanent;
    }

    return !!this.data.po;
  }

  set permanent(permanent: boolean) {
    if (this.parent) {
      this.parent.permanent = permanent;
      return;
    }

    if (permanent) {
      this.data.po = permanent;
    } else {
      delete this.data.po;
    }
  }

  get remote() {
    if (this.parent) {
      return this.parent.remote;
    }

    return !!this.data.ro;
  }

  set remote(remote: boolean) {
    /* satisfies */
    remote;
  }

  get parentId(): string | undefined {
    return this.data.parent_id;
  }

  set parentId(parentId: string | undefined) {
    this.data.parent_id = parentId!;
  }

  constructor(entity: ObjectEntity, engine: EngineManager) {
    super(entity, engine);

    this._messenger = new MessengerEmitterManager(engine);

    // restore position
    this.restoreData();

    // check for children
    this._checkForChildren();

    this.updateChunkIndex(false);
  }

  restoreData() {
    super.restoreData();

    // scale
    if (this.data.s !== undefined) {
      this.scale.set(...(this.data.s as Vector3Array));
    }
  }

  private _lastChunkIndex: ChunkIndex = null!;
  updateChunkIndex(emit = true) {
    // ignore client-side and if not the parent object
    if (this.engine.isClient || this.parent) return;

    super.updateChunkIndex();

    if (this._lastChunkIndex !== this.chunkIndex) {
      if (emit) {
        this.emitChunkIndexChange();
      }

      // update it
      this._lastChunkIndex = this.chunkIndex;
    }
  }

  emitChunkIndexChange() {
    this.engine.objects.events.emit(
      'onChunkIndexChange',
      this,
      this._lastChunkIndex,
    );
  }

  setPosition(position: Vector3 | Vector3Array) {
    this.updatePosition(position);

    this.updateChunkIndex();

    // emit
    if (this.parentId) {
      this.engine.objects.emitHandler(this, player => {
        this._messenger.emit(
          'setObjectPosition',
          [this.id, this.location.position.toArray()],
          player.id,
        );
      });
      return;
    }

    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectPositionFromWorldSpace',
        [this.id, this.location.position.toArray()],
        player.id,
      );
    });
  }

  setRotation(rotation: Quaternion | Euler | QuaternionArray | Vector3Array) {
    this.updateRotation(rotation);

    this.updateChunkIndex();

    // emit
    if (this.parentId) {
      this.engine.objects.emitHandler(this, player => {
        this._messenger.emit(
          'setObjectRotation',
          [this.id, this.location.quaternion.toArray() as QuaternionArray],
          player.id,
        );
      });

      return;
    }

    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectRotationFromWorldSpace',
        [this.id, this.location.quaternion.toArray() as QuaternionArray],
        player.id,
      );
    });
  }

  setScale(scale: Vector3 | Vector3Array) {
    this.updateScale(scale);

    this.updateChunkIndex();

    // emit
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectScale',
        [this.id, this.location.scale.toArray()],
        player.id,
      );
    });
  }

  updateScale(scale: Vector3 | Vector3Array) {
    // Vector3Array
    if (Array.isArray(scale)) {
      this.location.scale.set(...scale);
    } else {
      // Vector3
      this.location.scale.copy(scale);
    }
  }

  async setPositionFromWorldSpace(position: Vector3 | Vector3Array) {
    if (!this.parentId) {
      this.setPosition(position);
      return;
    }

    // resolve parent
    await this.resolveParent();

    // Vector3Array
    if (Array.isArray(position)) {
      _TEMP_POS.set(...position);
    } else {
      // Vector3
      _TEMP_POS.copy(position);
    }

    // position
    this.location.parent?.getWorldPosition(_TEMP_POS2);
    _TEMP_POS.sub(_TEMP_POS2);

    // rotation
    this.location.parent?.getWorldQuaternion(_TEMP_QUAT);
    _TEMP_POS.applyQuaternion(_TEMP_QUAT.invert());

    // scale
    this.location.parent?.getWorldScale(_TEMP_POS3);
    _TEMP_POS.divide(_TEMP_POS3);

    this.setPosition(_TEMP_POS);
  }

  async setRotationFromWorldSpace(
    rotation: Quaternion | Euler | QuaternionArray | Vector3Array,
  ) {
    if (!this.parentId) {
      this.setRotation(rotation);
      return;
    }

    // resolve parent
    await this.resolveParent();

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
      _TEMP_QUAT2.invert(),
      _TEMP_OBJECT.quaternion,
    );

    this.setRotation(_TEMP_QUAT);
  }

  detachFromParent() {
    if (!this.parent) return;

    this.parent.children.delete(this);
    this.parent.location.remove(this.location);
    this.parent = null!;
  }

  attachToParent(parent: ObjectManager) {
    parent = parent ?? this.engine.objects.get(this.parentId!);

    if (!parent) {
      console.debug(
        `[objects:script] no parent found (parent id: ${this.parentId} | object id: ${this.id}:${this.objectType})`,
      );
      return;
    }

    if (parent.objectType !== 'group') {
      console.debug(
        `[objects:script] only groups can have children (parent id: ${this.parentId}:${parent?.objectType} | object id ${this.id}:${this.objectType})`,
      );
      return;
    }

    this.parent = parent;
    parent.children.add(this);
    parent.location.add(this.location);
  }

  private _checkForChildren() {
    if (this.objectType !== 'group') return;

    // loop children
    (this.data as ObjectGroupType).o?.c?.forEach(item => {
      const data = item.o;

      if (data) {
        // set parent id
        item.parent_id = this.id;

        const child = this.engine.objects.get(item.id!);

        // create or update
        if (child) {
          // attach if not attached
          if (!child.parent) {
            child.attachToParent(this);
          }

          // update
          this.engine.objects.update(child, item as ObjectEntity['data']);
        } else {
          // create
          this.engine.objects.create(
            item.id!,
            item as ObjectEntity['data'],
            this,
          );
        }
      }
    });
  }

  edit() {
    this.engine.objects.edit(this);
  }

  async computeBoundingBox() {
    const {
      data: [box],
    } = await this._messenger.emitAsync('getObjectBoundingBox', [this.id]);

    if (!this.boundingBox) {
      this.boundingBox = new Box3();
    }

    _TEMP_POS.set(...box.min);
    _TEMP_POS2.set(...box.max);

    this.boundingBox.set(_TEMP_POS, _TEMP_POS2);

    return this.boundingBox;
  }

  async computeWorldBoundingBox() {
    const {
      data: [box],
    } = await this._messenger.emitAsync('getObjectWorldBoundingBox', [this.id]);

    if (!this.boundingBox) {
      this.boundingBox = new Box3();
    }

    _TEMP_POS.set(...box.min);
    _TEMP_POS2.set(...box.max);

    this.boundingBox.set(_TEMP_POS, _TEMP_POS2);

    return this.boundingBox;
  }

  async resolve(): Promise<ObjectManager | null> {
    return this.engine.objects.resolveObject(this.id, true);
  }

  async resolveParent(forceUpdate?: boolean): Promise<ObjectManager | null> {
    if (!this.parentId) return null;

    return this.engine.objects.resolveObject(this.parentId, forceUpdate);
  }

  setData<
    T extends ObjectType = ObjectType,
    D extends PickObject<T> = PickObject<T>,
  >(data: Partial<Omit<D, 'o'> & {o: Partial<D['o']>}>) {
    this.data = {
      ...this.data,
      ...data,

      o: {
        ...this.data.o,
        ...data.o,
      },
    };

    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectData',
        [
          this.id,
          {
            [this.objectType]: data,
          },
        ],
        player.id,
      );
    });
  }

  rerender() {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit('rerenderObject', [this.id], player.id);
    });
  }

  clone(withId?: string) {
    return this.engine.objects.clone(this, withId);
  }

  destroy() {
    this.engine.objects.destroy(this);
  }

  saveVolatile() {
    this.engine.objects.saveVolatile(this);
  }

  async sync() {
    this.engine.objects.sync(this);
  }

  async save() {
    this.engine.objects.save(this);
  }

  async delete() {
    this.engine.objects.delete(this);
  }

  toData(): ObjectDataProps {
    return {
      ...this.data,

      parent_id: this.parentId,

      // children
      ...(this.children && {
        o: {
          ...this.data.o,

          ...(this.children.size > 0 && {
            c: [...this.children.values()]?.map(e => e.toData()),
          }),
        },
      }),

      // update position & rotation
      p: this.position.toArray(),
      r: this.rotation.toArray() as QuaternionArray,
      s: this.scale.toArray(),
    };
  }
}

export default ObjectManager;
