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

import {ObjectBoxDto, ObjectDto} from 'engine/generated/dtos.types';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';

import {v4} from 'uuid';

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
      this.destroy(this.get(objectId), false);
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

      drawDistance: drawDistance ?? 'high',

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
}

export default ObjectsManager;
