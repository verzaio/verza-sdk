import {Box3, Euler, Object3D, Quaternion, Vector3} from 'three';

import {MATERIAL_MAPS} from 'engine/definitions/constants/materials.constants';
import {
  UNSUPPORTED_OBJECTS_BLOOM,
  UNSUPPORTED_OBJECTS_COLLISIONS,
  UNSUPPORTED_OBJECTS_SHADOWS,
} from 'engine/definitions/constants/objects-shared.constants';
import {
  ObjectEventMap,
  ObjectProximityActionEvent,
  ObjectSoundEvent,
} from 'engine/definitions/local/types/events.types';
import {EntityAttachOptions} from 'engine/definitions/types/attachments.types';
import {SoundEvent, SoundOptions} from 'engine/definitions/types/audio.types';
import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {
  EntityColliderType,
  EntityCollisionType,
  ObjectEntity,
} from 'engine/definitions/types/entities.types';
import {
  PickObject,
  PickObjectProps,
} from 'engine/definitions/types/objects/objects-definition.types';
import {ObjectTexture} from 'engine/definitions/types/objects/objects-materials.types';
import {
  ObjectDataProps,
  ObjectHighlightOptions,
  ObjectTransition,
  ObjectType,
} from 'engine/definitions/types/objects/objects.types';
import {
  Boolean3Array,
  EulerArray,
  ProximityActionEvent,
  ProximityActionOptions,
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import SoundManager from 'engine/managers/audio/sound.manager';
import ParticlesManager from 'engine/managers/effects/particles.manager';
import EngineManager from 'engine/managers/engine.manager';
import MessengerEmitterManager from 'engine/managers/messenger/messenger-emitter.manager';
import ProximityActionManager from 'engine/managers/world/proximity-action.manager';
import {ParticlesOptions} from 'engine/types';
import {toQuaternionArray, toVector3Array} from 'engine/utils/vectors.utils';

import EntityManager from '../../entity/entity.manager';
import ObjectHandleManager from './object-handle.manager';

type BoxProps = ObjectManager<'box'>['props'];

const _TEMP_POS = new Vector3();
const _TEMP_POS2 = new Vector3();
const _TEMP_POS3 = new Vector3();

const _TEMP_QUAT = new Quaternion();
const _TEMP_QUAT2 = new Quaternion();

const _TEMP_OBJECT = new Object3D();

class ObjectManager<OT extends ObjectType = ObjectType> extends EntityManager<
  ObjectEntity,
  ObjectHandleManager,
  ObjectEventMap
> {
  boundingBox: Box3 = null!;

  sound: SoundManager | null = null;

  particles: ParticlesManager | null = null!;

  proximityAction: ProximityActionManager | null = null!;

  private _visible = true;

  private _messenger: MessengerEmitterManager;

  private _worldLocation: Object3D = null!;

  /* getter & setters */
  get visible() {
    return this._visible;
  }

  get objectType() {
    return this.data.t;
  }

  get scale() {
    return this.location.scale;
  }

  get worldLocation() {
    if (!this._worldLocation) {
      this._worldLocation = new Object3D();
    }

    this._worldLocation.position.copy(this.worldPosition);
    this._worldLocation.quaternion.copy(this.worldQuaternion);

    this._worldLocation.scale.copy(this.location.scale);

    return this._worldLocation;
  }

  // TODO: Improve API design to avoid this
  get worldLocationSync() {
    return (async () => {
      await this.resolveParent();

      // TODO: Improve to resolve only transform
      await this.resolve();

      return this.worldLocation;
    })();
  }

  get permanent() {
    if (this.attachedTo?.isObject) {
      return (this.attachedTo as ObjectManager).permanent;
    }

    return !!this.data.po;
  }

  set permanent(permanent: boolean) {
    if (this.parentObject) {
      this.parentObject.permanent = permanent;
      return;
    }

    if (permanent) {
      this.data.po = permanent;
    } else {
      delete this.data.po;
    }
  }

  get remote() {
    return this.parentObject?.remote ?? !!this.data.rm;
  }

  set remote(remote: boolean) {
    /* satisfies */
    remote;
  }

  get parentObject(): ObjectManager | undefined {
    if (this.parentObjectId) {
      return this.engine.objects.get(this.parentObjectId);
    }
  }

  get parentObjectId(): string | undefined {
    return this.data.parent_id;
  }

  set parentObjectId(parentId: string | undefined) {
    this.data.parent_id = parentId!;
  }

  get userData() {
    return this.data.o.userData ?? {};
  }

  get props(): PickObject<OT>['o'] {
    return this.data.o;
  }

  get supportsShadows() {
    return !UNSUPPORTED_OBJECTS_SHADOWS.has(this.objectType);
  }

  get shadows() {
    return this.data.ss ?? this.supportsShadows;
  }

  get supportsBloom() {
    return !UNSUPPORTED_OBJECTS_BLOOM.has(this.objectType);
  }

  get bloom() {
    return (this.data.o as BoxProps).bloom ?? false;
  }

  get supportsCollision() {
    return !UNSUPPORTED_OBJECTS_COLLISIONS.has(this.objectType);
  }

  get collision(): EntityCollisionType | null {
    if (!this.supportsCollision) {
      return null;
    }

    return this.data.c ?? null;
  }

  get collider() {
    return this.data.cc ?? null;
  }

  get sensor() {
    if (!this.supportsCollision) {
      return false;
    }

    return !!this.data.cs;
  }

  get mass() {
    return this.data.m;
  }

  get friction() {
    return this.data.ff;
  }

  get restitution() {
    return this.data.rr;
  }

  get enabledRotations() {
    return this.data.er;
  }

  get enabledTranslations() {
    return this.data.et;
  }

  constructor(entity: ObjectEntity, engine: EngineManager) {
    super(entity, engine);

    this._messenger = new MessengerEmitterManager(engine);

    // restore position
    this.restoreData();

    // check for children
    this._checkForChildren();

    // check for parent via data.parent_id
    if (this.parentObject) {
      this.parentObject?.attach(this);
      return;
    }

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
    if (this.engine.isClient || this.parentObjectId) return;

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
    if (this.parentObjectId) {
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

  setRotation(rotation: Quaternion | Euler | QuaternionArray | EulerArray) {
    this.updateRotation(rotation);

    this.updateChunkIndex();

    // emit
    if (this.parentObjectId) {
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

  setShadows(status: boolean) {
    this.setData({
      ss: status,
    } as PickObject<OT>);
  }

  setBloom(status: boolean) {
    this.setData({
      o: {
        bloom: status,
      },
    } as PickObject<OT>);
  }

  setCollision(collision: EntityCollisionType | null) {
    this.setData({
      c: collision,
    } as PickObject<OT>);
  }

  setCollider(collider: EntityColliderType | null) {
    this.setData({
      cc: collider,
    } as PickObject<OT>);
  }

  setMass(mass: number) {
    this.setData({
      m: mass,
    } as PickObject<OT>);
  }

  setFriction(friction: number) {
    this.setData({
      ff: friction,
    } as PickObject<OT>);
  }

  setRestitution(restitution: number) {
    this.setData({
      rr: restitution,
    } as PickObject<OT>);
  }

  setEnabledRotations(enabledRotations: Boolean3Array) {
    this.setData({
      er: enabledRotations,
    } as PickObject<OT>);
  }

  setEnabledTranslations(enabledTranslations: Boolean3Array) {
    this.setData({
      et: enabledTranslations,
    } as PickObject<OT>);
  }

  async setPositionFromWorldSpace(position: Vector3 | Vector3Array) {
    if (!this.parentObjectId) {
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
    rotation: Quaternion | Euler | QuaternionArray | EulerArray,
  ) {
    if (!this.parentObjectId) {
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

  private _checkForChildren() {
    // loop children
    this.data.o?.c?.forEach(item => {
      if (!item.o) return;

      // set parent id
      item.parent_id = this.id;

      const child = this.engine.objects.get(item.id!);

      // create or update
      if (child) {
        // attach if not attached
        if (!child.parentObject) {
          this._attach(child, {}, false);
        }

        // update
        this.engine.objects.update(child, item as ObjectEntity['data']);
      } else {
        // create
        this.engine.objects._createRaw(
          item.id!,
          item as ObjectEntity['data'],
          this,
        );
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
    return this.engine.objects.resolve(this.id, true);
  }

  async resolveParent(forceUpdate?: boolean): Promise<ObjectManager | null> {
    if (!this.parentObjectId) return null;

    return this.engine.objects.resolve(this.parentObjectId, forceUpdate);
  }

  setVisible(visible: boolean) {
    this._visible = visible;

    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit('setObjectVisible', [this.id, visible], player.id);
    });
  }

  setHelper(status: boolean) {
    this._messenger.emit('setObjectHelper', [this.id, status]);
  }

  enableHighlight(options: ObjectHighlightOptions = {}) {
    this._messenger.emit('enableObjectHighlight', [this.id, options]);
  }

  disableHighlight() {
    this._messenger.emit('disableObjectHighlight', [this.id]);
  }

  setProps<D extends PickObjectProps<OT> = PickObjectProps<OT>>(
    props: Partial<D>,
    partial = true,
  ) {
    this.setData({o: props, partial} as unknown as PickObject<OT>);
  }

  setData<D extends PickObject<OT> = PickObject<OT>>(
    data: Partial<Omit<D, 'o'> & {o: Partial<D['o']>}>,
    partial = true,
  ) {
    const {o: props, ...rest} = data;
    Object.assign(this.data, rest);

    // update props
    if (props) {
      if (!partial) {
        Object.assign(this.data.o, props);
      } else {
        const {material, userData, ...rest} = props as BoxProps;
        Object.assign(this.data.o as BoxProps, rest);

        // material
        if (material) {
          if (!(this.data.o as BoxProps).material) {
            (this.data.o as BoxProps).material = {};
          }

          // check maps
          Object.entries(material).forEach(([key, value]) => {
            if (
              !MATERIAL_MAPS.has(key as 'map') ||
              value === null ||
              typeof value !== 'object'
            ) {
              (this.data.o as any).material[key] = value;
              return;
            }

            if (!(this.data.o as BoxProps).material![key as 'map']) {
              (this.data.o as BoxProps).material![key as 'map'] =
                {} as ObjectTexture;
            }

            Object.assign(
              (this.data.o as BoxProps).material![
                key as 'map'
              ] as ObjectTexture,
              value,
            );
          });
        }

        // user data
        if (userData) {
          if (!this.data.o.userData) {
            this.data.o.userData = {};
          }

          Object.assign(this.data.o.userData, userData);
        }
      }
    }

    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectData',
        [
          this.id,
          {
            [this.objectType]: data,
          },
          partial,
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

  async isStreamed() {
    const {
      data: [streamed],
    } = await this.engine.messenger.emitAsync('isObjectStreamed', [this.id]);

    return streamed;
  }

  async waitForStream(): Promise<void> {
    return new Promise(resolve => {
      const onStreamIn = this.engine.messenger.events.on(
        `onObjectStreamInRaw_${this.id}`,
        () => {
          this.engine.messenger.events.off(
            `onObjectStreamInRaw_${this.id}`,
            onStreamIn,
          );

          resolve();
        },
      );

      this.isStreamed().then(isStreamed => {
        if (isStreamed) {
          resolve();

          this.engine.messenger.events.off(
            `onObjectStreamInRaw_${this.id}`,
            onStreamIn,
          );
        }
      });
    });
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

      parent_id: this.parentObjectId,

      // props
      o: {
        ...this.data.o,

        ...(this.attachedEntities.size > 0 && {
          c: [...this.attachedEntities.keys()]
            .filter(entity => entity.isObject)
            ?.map(entity => (entity as ObjectManager).toData()),
        }),
      },

      p: this.position.toArray(),
      r: this.quaternion.toArray() as QuaternionArray,
      s: this.scale.toArray(),
    };
  }

  setLinearVelocity(vector: Vector3Array) {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectLinearVelocity',
        [this.id, vector],
        player.id,
      );
    });
  }

  setAngularVelocity(vector: Vector3Array) {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'setObjectAngularVelocity',
        [this.id, vector],
        player.id,
      );
    });
  }

  applyImpulse(vector: Vector3Array) {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit('applyObjectImpulse', [this.id, vector], player.id);
    });
  }

  addTorque(vector: Vector3Array) {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit('addObjectTorque', [this.id, vector], player.id);
    });
  }

  applyTorqueImpulse(vector: Vector3Array) {
    this.engine.objects.emitHandler(this, player => {
      this._messenger.emit(
        'applyObjectTorqueImpulse',
        [this.id, vector],
        player.id,
      );
    });
  }

  private _normalizeVectors(transition: ObjectTransition) {
    if (transition.to) {
      transition.to = toVector3Array(transition.to);
    }

    if (transition.from) {
      transition.from = toVector3Array(transition.from);
    }

    if (transition.toRotation) {
      transition.toRotation = toQuaternionArray(transition.toRotation);
    }

    if (transition.fromRotation) {
      transition.fromRotation = toQuaternionArray(transition.fromRotation);
    }
  }

  startTransitions(transitions: ObjectTransition[]) {
    transitions.forEach(transition => {
      this._normalizeVectors(transition);
    });

    this._messenger.emit('startObjectTransitions', [this.id, transitions]);
  }

  startTransition(transition: ObjectTransition) {
    this._normalizeVectors(transition);

    this._messenger.emit('startObjectTransition', [this.id, transition]);
  }

  clearTransitions() {
    this._messenger.emit('stopObjectTransitions', [this.id]);
  }

  createSound(soundName: string, options?: SoundOptions, withId?: string) {
    return this.engine.audio.createObjectSound(
      this,
      soundName,
      options,
      withId,
    );
  }

  /**
   * @private
   */
  _setSound(soundName: string, options?: SoundOptions) {
    this.sound = this.engine.audio.createObjectSound(
      this.id,
      soundName,
      {
        loop: 'repeat',

        autoplay: true,

        ...options,
      },
      this.id,
    );

    return this.sound;
  }

  /**
   * @private
   */
  _removeSound() {
    this.sound?.destroy();
    this.sound = null;
  }

  createParticles(options?: ParticlesOptions, withId?: string) {
    return this.engine.effects.createObjectParticles(this, options, withId);
  }

  /**
   * @private
   */
  _setParticles(options?: ParticlesOptions) {
    this.particles = this.engine.effects.createObjectParticles(
      this.id,
      options,
      this.id,
    );

    return this.particles;
  }

  /**
   * @private
   */
  _removeParticles() {
    this.particles?.destroy();
    this.particles = null;
  }

  createProximityAction(options?: ProximityActionOptions, withId?: string) {
    return this.engine.world.createObjectProximityAction(this, options, withId);
  }

  /**
   * @private
   */
  _setProximityAction(action: Omit<ProximityActionOptions, 'objectId'>) {
    this.proximityAction = this.engine.world.createObjectProximityAction(
      this,
      action,
      this.id,
    );

    return this.proximityAction;
  }

  /**
   * @private
   */
  _removeProximityAction() {
    this.proximityAction?.destroy();
    this.proximityAction = null;
  }

  /* binds */
  /**
   * @private
   */
  _onTransitionStart = (id: number | string) => {
    this.events.emit('onTransitionStart', id);
  };

  /**
   * @private
   */
  _onTransitionEnd = (id: number | string) => {
    this.events.emit('onTransitionEnd', id);
  };

  /**
   * @private
   */
  _onProximityActionTriggered = (event: ProximityActionEvent) => {
    this.events.emit('onProximityActionTriggered', {
      ...event,
      object: this,
    } as ObjectProximityActionEvent<OT>);
  };

  /**
   * @private
   */
  _onSoundEnd = (event: SoundEvent) => {
    this.events.emit('onSoundEnd', {
      ...event,
      object: this,
    } as ObjectSoundEvent<OT>);
  };

  /**
   * @private
   */
  _onEnterSensor = (playerId: number) => {
    this.events.emit('onEnterSensor', this.engine.players.get(playerId));
  };

  /**
   * @private
   */
  _onLeaveSensor = (playerId: number) => {
    this.events.emit('onLeaveSensor', this.engine.players.get(playerId));
  };

  attach(entity: EntityManager, options?: EntityAttachOptions) {
    // set parent id
    if (entity.isObject) {
      (entity as ObjectManager).data.parent_id = this.id;
    }

    super.attach(entity, options);
  }

  detach(entity: EntityManager, isDestroy?: boolean): void {
    // unset parent id
    if (entity.isObject && !isDestroy) {
      delete (entity as ObjectManager).data.parent_id;
    }

    super.detach(entity);
  }
}

export default ObjectManager;
