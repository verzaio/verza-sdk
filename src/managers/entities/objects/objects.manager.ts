import {v4} from 'uuid';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {
  CreateObjectProps,
  CreateObjectPropsWithObjects,
  ObjectType,
} from 'engine/definitions/types/objects.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {ObjectBoxDto, ObjectChildrenDto} from 'types/Dto';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';

class ObjectsManager extends EntitiesManager<ObjectManager> {
  private _binded = false;

  private get _messenger() {
    return this.engine.messenger;
  }

  constructor(engine: EngineManager) {
    super(EntityType.object, engine);
  }

  private _load() {
    if (this._binded) return;

    this._messenger.events.on('destroyObject', ({data: [objectId]}) => {
      this.destroy(this.get(objectId));
    });

    this._binded = true;
  }

  unload() {
    this._binded = false;
  }

  private _createObject<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectPropsWithObjects<T>,
  ) {
    // load
    this._load();

    if (!props.id) {
      props.id = v4();
    }

    props.position = Array.isArray(props.position)
      ? props.position
      : props.position?.toArray() ?? [0, 0, 0];

    props.rotation = !props.rotation
      ? [0, 0, 0, 1]
      : Array.isArray(props.rotation)
      ? props.rotation
      : (props.rotation.toArray() as QuaternionArray);

    if (props.data) {
      props[type] = props.data;
    }

    const {position, rotation, drawDistance, collision, scale, shadows} = props;

    const object = this.create(props.id!, {
      id: props.id!,

      t: type,

      position: (position as Vector3Array) ?? [0, 0, 0],

      rotation: (rotation as QuaternionArray) ?? [0, 0, 0, 1],

      p: null!,

      s: null!,

      m: {
        d: drawDistance ?? 'high',

        p: collision,

        s: scale,

        ss: shadows,

        [type]: props[type],
      },
    });

    // emit
    this._messenger.emit('createObject', [type, props]);

    return object;
  }

  createGroup(
    children: ObjectChildrenDto[],
    props: CreateObjectProps<'group'> = {},
  ) {
    return this._createObject('group', {
      group: {
        c: children,
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

  destroy(entity: ObjectManager): void {
    super.destroy(entity);

    // emit
    if (entity) {
      this._messenger.emit('destroyObject', [entity.id]);
    }
  }
}

export default ObjectsManager;
