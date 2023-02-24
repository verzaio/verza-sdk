import {v4} from 'uuid';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';
import {
  ObjectBoxType,
  ObjectGroupType,
  ObjectTypeValues,
  PickObject,
} from 'engine/definitions/types/objects/objects-definition.types';
import {
  ObjectEditAxes,
  ObjectType,
} from 'engine/definitions/types/objects/objects.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import ControllerManager from 'engine/managers/controller.manager';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';

class ObjectsManager extends EntitiesManager<ObjectManager> {
  controller = new ControllerManager({
    editingObject: null! as ObjectManager,
  });

  get editingObject() {
    return this.controller.data.editingObject;
  }

  private _loadBinded = false;

  private get _messenger() {
    return this.engine.messenger;
  }

  constructor(engine: EngineManager) {
    super(EntityType.object, engine);
  }

  private _bind() {
    if (this._loadBinded) return;
    this._loadBinded = true;

    this._messenger.events.on('destroyObject', ({data: [objectId]}) => {
      this.destroy(this.get(objectId), false);
    });
  }

  unload() {
    this._loadBinded = false;
  }

  ensure(id: string, data: ObjectManager['data']) {
    const object = this.get(id);

    // create
    if (!object) {
      return this.create(id, data);
    }

    // update
    this.update(object, data);

    return object;
  }

  update(object: ObjectManager, data: ObjectManager['data']) {
    // update
    object.updatePosition(data.p!);
    object.updateRotation(data.r!);
    object.updateScale(data.s!);

    // set data
    object.data = data;

    // update children
    if (object.objectType === 'group') {
      (data as ObjectGroupType).o?.c?.forEach(data => {
        const child = this.get(data.id!);

        if (child) {
          this.update(child, data);
        }
      });
    }

    return object;
  }

  create(
    id: string,
    data?: ObjectManager['data'],
    parent?: ObjectManager,
  ): ObjectManager {
    // bind
    this._bind();

    const object = super.create(id, data);

    // check for parent
    if (parent) {
      object.attachToParent(parent);
    }

    return object;
  }

  private _createObject<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectProps<T>,
  ) {
    // validate id
    if (!props.id) {
      props.id = v4();
    }

    // validate pos
    if (props.position) {
      props.position = Array.isArray(props.position)
        ? props.position
        : props.position.toArray();
    }

    // validate rot
    if (props.rotation) {
      props.rotation = Array.isArray(props.rotation)
        ? props.rotation
        : (props.rotation.toArray() as QuaternionArray);
    }

    // validate rot
    if (props.scale) {
      props.scale = Array.isArray(props.scale)
        ? props.scale
        : props.scale.toArray();
    }

    const {
      id,
      parentId,
      position,
      rotation,
      drawDistance,
      collision,
      scale,
      shadows,
    } = props;

    const objectData: PickObject<any> = {
      id,

      parent_id: parentId,

      t: type,

      dd: drawDistance,

      p: position,

      r: rotation,

      s: scale,

      c: collision,

      ss: shadows,

      o: props.data,
    };

    // create
    const object = this.create(props.id!, objectData);

    // emit
    this._messenger.emit('createObject', [
      objectData.id!,
      {
        [objectData.t]: objectData,
      },
    ]);

    return object;
  }

  createGroup(
    children: ObjectTypeValues[] = [],
    props: CreateObjectProps<'group'> = {},
  ) {
    return this._createObject('group', {
      data: {
        c: children ?? [],
      },
      ...props,
    });
  }

  createModel(model: string, props: CreateObjectProps<'model'> = {}) {
    return this._createObject('model', {
      data: {
        m: model,
      },
      ...props,
    });
  }

  createGltf(url: string, props: CreateObjectProps<'gltf'> = {}) {
    return this._createObject('gltf', {
      data: {
        u: url,
      },
      ...props,
    });
  }

  createBox(box: ObjectBoxType['o'], props: CreateObjectProps<'box'> = {}) {
    return this._createObject('box', {
      data: box,
      ...props,
    });
  }

  createLine(
    points: Vector3Array[],
    color?: string,
    props: CreateObjectProps<'line'> = {},
  ) {
    return this._createObject('line', {
      data: {
        p: points.map(p => p),
        c: color,
      },
      ...props,
    });
  }

  destroy(entity: ObjectManager, report = true): void {
    if (!this.is(entity?.id)) {
      return;
    }

    // detach
    entity.detachFromParent();

    // destroy children
    entity.children.forEach(entity => {
      this.destroy(entity);
    });

    // destroy
    super.destroy(entity);

    // emit
    if (report) {
      this._messenger.emit('destroyObject', [entity.id]);
    }
  }

  private _onObjectEdit: ScriptMessengerMethods['onObjectEditRaw'] = ({
    data: [data, type],
  }) => {
    this.engine.events.emit('onObjectEdit', this.ensure(data.id!, data), type);
  };

  private _editBinded = false;
  edit(object: ObjectManager) {
    if (!this._editBinded) {
      this._editBinded = true;
      this._messenger.events.on('onObjectEditRaw', this._onObjectEdit);
    }

    this._messenger.emit('editObject', [object.id]);

    this.controller.set('editingObject', object);
  }

  cancelEdit() {
    this._messenger.emit('cancelObjectEdit');
    this.controller.set('editingObject', null!);
  }

  setEditSnaps(
    position: number | null,
    rotation: number | null,
    scale: number | null,
  ) {
    this._messenger.emit('setObjectEditSnaps', [position, rotation, scale]);
  }

  setEditAxes(axes: ObjectEditAxes) {
    this._messenger.emit('setObjectEditAxes', [axes]);
  }

  async resolveObject(
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
}

export default ObjectsManager;
