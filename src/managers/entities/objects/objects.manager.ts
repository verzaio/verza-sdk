import {v4} from 'uuid';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';
import {
  CreateObjectProps,
  CreateObjectPropsWithObjects,
  ObjectType,
} from 'engine/definitions/types/objects.types';
import {ObjectEditMode} from 'engine/definitions/types/scripts.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {ObjectBoxDto, ObjectDto} from 'engine/generated/dtos.types';
import ControllerManager from 'engine/managers/controller.manager';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';

class ObjectsManager extends EntitiesManager<ObjectManager> {
  objectMode: ObjectEditMode = 'position';

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
    object.updatePosition(data.position!);
    object.updateRotation(data.rotation!);

    // set data
    object.data = data;

    return object;
  }

  private _createObject<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectPropsWithObjects<T>,
  ) {
    // load
    this._bind();

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

    const objectData: ObjectManager['data'] = {
      id,

      parent_id: parentId,

      t: type,

      drawDistance,

      position,

      rotation,

      m: {
        p: collision,

        s: scale,

        ss: shadows,

        [type]: props.data,
      },
    };

    // create
    const object = this.create(props.id!, objectData);

    // emit
    this._messenger.emit('createObject', [type, props]);

    return object;
  }

  createGroup(children?: ObjectDto[], props: CreateObjectProps<'group'> = {}) {
    return this._createObject('group', {
      group: {
        c: children ?? [],
      },
      ...props,
    });
  }

  createModel(model: string, props: CreateObjectProps<'model'> = {}) {
    return this._createObject('model', {
      model: {
        m: model,
      },
      ...props,
    });
  }

  createBox(box: ObjectBoxDto, props: CreateObjectProps<'box'> = {}) {
    return this._createObject('box', {
      box,
      ...props,
    });
  }

  createLine(
    points: Vector3Array[],
    color?: string,
    props: CreateObjectProps<'line'> = {},
  ) {
    return this._createObject('line', {
      line: {
        p: points.map(p => ({p})),
        c: color,
      },
      ...props,
    });
  }

  createGltf(url: string, props: CreateObjectProps<'gltf'> = {}) {
    return this._createObject('gltf', {
      gltf: {
        u: url,
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
    this.engine.events.emit('onObjectEdit', this.ensure(data.id, data), type);
  };

  edit(object: ObjectManager, mode: ObjectEditMode = 'position') {
    this.objectMode = mode;

    this._messenger.events.on('onObjectEditRaw', this._onObjectEdit);
    this._messenger.emit('editObject', [object.id, mode]);

    this.controller.set('editingObject', object);
  }

  cancelEdit() {
    this._messenger.events.off('onObjectEditRaw', this._onObjectEdit);
    this._messenger.emit('cancelObjectEdit');
    this.controller.set('editingObject', null!);
  }

  setEditMode(mode: ObjectEditMode) {
    this.objectMode = mode;
    this._messenger.emit('setObjectEditMode', [mode]);
  }

  setEditSnaps(position: number | null, rotation: number | null) {
    this._messenger.emit('setObjectEditSnaps', [position, rotation]);
  }
}

export default ObjectsManager;
