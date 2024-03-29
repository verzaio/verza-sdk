import {Euler} from 'three';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';
import {
  ObjectGroupType,
  PickObject,
} from 'engine/definitions/types/objects/objects-definition.types';
import {
  ObjectDataProps,
  ObjectEditAxes,
  ObjectType,
} from 'engine/definitions/types/objects/objects.types';
import {QuaternionArray} from 'engine/definitions/types/world.types';
import MessengerEmitterManager from 'engine/managers/messenger/messenger-emitter.manager';
import {uuid} from 'engine/utils/misc.utils';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import PlayerManager from '../players/player/player.manager';
import ObjectManager from './object/object.manager';
import ObjectsHandlerManager from './objects-handler.manager';

class ObjectsManager extends EntitiesManager<ObjectManager> {
  editingObject: ObjectManager = null!;

  private _binded = false;

  private _messenger: MessengerEmitterManager;

  private _handler: ObjectsHandlerManager;

  constructor(engine: EngineManager) {
    super(EntityType.object, engine);

    this._messenger = new MessengerEmitterManager(engine);

    this._handler = new ObjectsHandlerManager(this, this._messenger);
  }

  bind() {
    if (this._binded) return;
    this._binded = true;

    this._handler.bind();
  }

  unload() {
    if (!this._binded) return;
    this._binded = false;

    this._handler.unbind();
  }

  ensure(id: string, data: ObjectManager['data']) {
    const object = this.get(id);

    // create
    if (!object) {
      return this._createRaw(id, data);
    }

    // update
    this.update(object, data);

    return object;
  }

  update(object: ObjectManager, data: ObjectManager['data'], sync?: boolean) {
    // update
    if (sync) {
      const {p, r, s, ...rest} = data;

      p && object.setPosition(p);
      r && object.setRotation(r);
      s && object.setScale(s);

      // set data
      object.setData(rest);
    } else {
      data.p && object.updatePosition(data.p);
      data.r && object.updateRotation(data.r);
      data.s && object.updateScale(data.s);

      object.updateChunkIndex();

      // set data
      object.data = data;
    }

    // update children
    (data as ObjectGroupType).o?.c?.forEach(data => {
      const child = this.get(data.id!);

      if (child) {
        this.update(child, data);
      }
    });

    return object;
  }

  _createRaw(
    id: string,
    data: ObjectManager['data'],
    parent?: ObjectManager,
  ): ObjectManager {
    // bind
    this.bind();

    const object = super._create(id, data);

    // check for parent
    if (parent) {
      object._attach(parent, {}, false);
    }

    return object;
  }

  create<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectProps<T> = {},
  ) {
    return this._createFromType(type, props);
  }

  createFromData(data: ObjectDataProps, id?: string) {
    const objectId = id ?? data.id!;

    const object = this._createRaw(objectId, data);

    // emit
    this.emitHandler(object, player => {
      this._messenger.emit(
        'createObject',
        [
          objectId,
          {
            [data.t]: data,
          },
        ],
        player.id,
      );
    });

    return object;
  }

  private _createFromType<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectProps<T> = {},
  ) {
    // validate id
    if (!props.id) {
      props.id = uuid();
    }

    // validate pos
    if (props.position && !Array.isArray(props.position)) {
      props.position = props.position.toArray();
    }

    // validate rot
    if (props.rotation && !Array.isArray(props.rotation)) {
      // Euler
      if (props.rotation instanceof Euler) {
        props.rotation = [props.rotation.x, props.rotation.y, props.rotation.z];
      } else {
        // Quaternion
        props.rotation = props.rotation.toArray() as QuaternionArray;
      }
    }

    // validate rot
    if (props.scale !== undefined) {
      if (typeof props.scale === 'number') {
        props.scale = [props.scale, props.scale, props.scale];
      } else if (!Array.isArray(props.scale)) {
        props.scale = props.scale.toArray();
      }
    }

    const {
      id,
      parentId,
      position,
      rotation,
      drawDistance,

      scale,
      shadows,
      renderOrder,

      collision,
      collider,
      sensor,
      mass,
      friction,
      restitution,
      enabledRotations,
      enabledTranslations,

      ...dataProps
    } = props;

    const objectData: PickObject<ObjectType> = {
      id,

      t: type,

      o: dataProps as any,

      ...(parentId && {parent_id: parentId}),

      ...(position && {p: position}),

      ...(rotation && {r: rotation}),

      ...(scale && {s: scale}),

      ...(drawDistance !== undefined && {dd: drawDistance}),

      ...(shadows !== undefined && {ss: shadows}),

      ...(renderOrder !== undefined && {ro: renderOrder}),

      ...(typeof collision === 'boolean'
        ? collision && {c: 'static'}
        : collision !== undefined && {c: collision}),

      ...(collider !== undefined && {cc: collider}),

      ...(sensor !== undefined && {cs: sensor}),

      ...(mass !== undefined && {m: mass}),

      ...(friction !== undefined && {ff: friction}),

      ...(restitution !== undefined && {rr: restitution}),

      ...(enabledRotations !== undefined && {er: enabledRotations}),

      ...(enabledTranslations !== undefined && {et: enabledTranslations}),
    };

    if (this.is(objectData.id!)) {
      return this.update(this.get(props.id), objectData, true);
    }

    // create
    const object = this._createRaw(props.id!, objectData);

    // chunk change
    if (this.engine.isServer && !object.parentObjectId) {
      this.engine.streamer.refreshEntity(object);
    }

    // emit
    this.emitHandler(object, player => {
      this._messenger.emit(
        'createObject',
        [
          objectData.id!,
          {
            [objectData.t]: objectData,
          },
        ],
        player.id,
      );
    });

    return object;
  }

  destroy(entity: ObjectManager, report = true): void {
    if (!this.is(entity?.id)) {
      return;
    }

    // detach
    entity._detach(false);

    // destroy attached entities
    entity.attachedEntities.forEach(entity => {
      if (entity.isObject) {
        this.destroy(entity as ObjectManager, report);
      }
    });

    // destroy
    super.destroy(entity);

    // emit
    if (report) {
      this.emitHandler(entity, player => {
        this._messenger.emit('destroyObject', [entity.id], player.id);
      });
    }
  }

  private _onObjectEdit: ScriptMessengerMethods['onObjectEditRaw'] = ({
    data: [data, type, transform],
  }) => {
    this._CHECK_FOR_CLIENT();

    this.engine.events.emit(
      'onObjectEdit',
      this.ensure(data.id!, data),
      type,
      transform,
    );
  };

  private _editBinded = false;
  edit(object: ObjectManager) {
    this._CHECK_FOR_CLIENT();

    if (!this._editBinded) {
      this._editBinded = true;
      this._messenger.events.on('onObjectEditRaw', this._onObjectEdit);
    }

    this._messenger.emit('editObject', [object.id]);

    this.editingObject = object;
  }

  cancelEdit() {
    this._CHECK_FOR_CLIENT();

    this._messenger.emit('cancelObjectEdit');
    this.editingObject = null!;
  }

  setEditSnaps(
    position: number | null,
    rotation: number | null,
    scale: number | null,
  ) {
    this._CHECK_FOR_CLIENT();

    this._messenger.emit('setObjectEditSnaps', [position, rotation, scale]);
  }

  setEditAxes(axes: ObjectEditAxes) {
    this._CHECK_FOR_CLIENT();

    this._messenger.emit('setObjectEditAxes', [axes]);
  }

  async resolve(
    objectId: string,
    forceUpdate?: boolean,
  ): Promise<ObjectManager> {
    if (!forceUpdate) {
      const object = this.get(objectId);

      if (object) return object;
    }

    const {
      data: [objectProps],
    } = await this._messenger.emitAsync('getObject', [objectId]);

    if (!objectProps) return null!;

    return this.ensure(objectId, objectProps);
  }

  async clone(object: ObjectManager, withId?: string) {
    this._CHECK_FOR_CLIENT();

    const {
      data: [objectProps],
    } = await this._messenger.emitAsync('getObject', [object.id]);

    // we leave the same parent as the original object
    //delete objectProps.parent_id

    // clean props
    this._cleanObjectProps(objectProps);

    const id = withId ?? uuid();

    objectProps.id = id;

    const newObject = this.createFromData(objectProps, id);

    return newObject;
  }

  private _cleanObjectProps(objectProps: ObjectDataProps) {
    (objectProps as ObjectGroupType).o?.c?.forEach(e => {
      // remove id & parent
      delete e.id;
      delete e.parent_id;

      this._cleanObjectProps(e);
      return;
    });
  }

  emitHandler(
    object: ObjectManager,
    callback: (player: PlayerManager) => void,
  ) {
    // client or webserver
    if (this.engine.isClient || this.engine.api.isWebServer) {
      callback(this.engine.localPlayer);
      return;
    }

    // or websockets server
    this.engine.players.forEachInChunk(object.chunkIndex, callback);
  }

  private _CHECK_FOR_CLIENT() {
    if (!this.engine.isClient) {
      throw new Error('This method is only available on client');
    }
  }

  private _savingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  private _cleanSavingTimeout(object: ObjectManager) {
    const savingTimeout = this._savingTimeouts.get(object.id);

    if (savingTimeout) {
      clearTimeout(savingTimeout);
      this._savingTimeouts.delete(object.id);
    }
  }

  saveVolatile(object: ObjectManager) {
    if (this._savingTimeouts.has(object.id)) return;

    // clear timeout
    this._cleanSavingTimeout(object);

    this._savingTimeouts.set(
      object.id,
      setTimeout(() => {
        this._savingTimeouts.delete(object.id);

        object.save();
      }, 100),
    );
  }

  async sync(object: ObjectManager) {
    // find parent
    if (object.parentObject) {
      this.sync(object.parentObject);
      return;
    }

    if (!object.remote) return;

    // sync it
    this._messenger.emit('syncObjectLocal', [object.id]);
  }

  async save(object: ObjectManager) {
    // find parent
    if (object.parentObject) {
      await object.parentObject.save();
      return;
    }

    if (this.engine.isClient) {
      await this._messenger.emitAsync('saveObjectLocal', [object.id]);
    } else {
      await this._messenger.emitAsync('saveObject', [
        object.id,
        {
          [object.objectType]: object.toData(),
        },
      ]);
    }

    // remove from streamer, now it will be
    // handled by verza's servers
    this.engine.streamer?.removeEntity(object);

    object.permanent = true;
  }

  async delete(object: ObjectManager) {
    // find parent
    if (object.parentObject) {
      await object.parentObject.delete();
      return;
    }

    // allow to delete only if permanent or remote
    if (!object.permanent && !object.remote) {
      this.destroy(object);
      return;
    }

    this._cleanSavingTimeout(object);

    await this._messenger.emitAsync('deleteObject', [object.id]);

    object.permanent = false;

    this.destroy(object, false);
  }
}

export default ObjectsManager;
