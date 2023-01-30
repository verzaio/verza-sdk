import {v4} from 'uuid';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {
  CreateObjectProps,
  ObjectType,
} from 'engine/definitions/types/objects.types';
import {
  QuaternionArray,
  VectorArray,
} from 'engine/definitions/types/world.types';
import {ObjectBoxDto} from 'types/Dto';

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
      console.log('destroyObject', objectId);
      this.destroy(this.get(objectId));
    });

    this._binded = true;
  }

  unload() {
    this._binded = false;
  }

  private _prepareProps(props?: CreateObjectProps<any>) {
    if (!props) return;

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
  }

  private _createObject<T extends ObjectType = ObjectType>(
    type: T,
    props: CreateObjectProps<T>,
  ) {
    // load
    this._load();

    const {position, rotation, data, drawDistance, physics, scale, shadows} =
      props;

    const object = this.create(props.id!, {
      id: props.id!,

      t: type,

      position: (position as VectorArray) ?? [0, 0, 0],

      rotation: (rotation as QuaternionArray) ?? [0, 0, 0, 1],

      p: null!,

      s: null!,

      m: {
        d: drawDistance ?? 'high',

        p: physics,

        s: scale,

        ss: shadows,

        [type]: data,
      },
    });

    return object;
  }

  createBox(box: ObjectBoxDto, props: CreateObjectProps<'box'> = {}) {
    // prepare
    this._prepareProps(props);

    const object = this._createObject('box', {
      data: box,
      ...props,
    });

    // emit
    this._messenger.emit('createBox', [box, props]);

    return object;
  }

  createLine(
    points: VectorArray[],
    color?: string,
    props: CreateObjectProps<'line'> = {},
  ) {
    // prepare
    this._prepareProps(props);

    const object = this._createObject('line', {
      data: {
        p: points.map(p => ({p})),
        c: color,
      },
      ...props,
    });

    // emit
    this._messenger.emit('createLine', [points, color, props]);

    return object;
  }

  createGltf(url: string, props: CreateObjectProps<'gltf'> = {}) {
    // prepare
    this._prepareProps(props);

    const object = this._createObject('gltf', {
      data: {
        u: url,
      },
      ...props,
    });

    // emit
    this._messenger.emit('onCreateGltf', [url, props]);

    return object;
  }

  destroy(entity: ObjectManager): void {
    super.destroy(entity);

    // emit
    this._messenger.emit('destroyObject', [entity.id]);
  }
}

export default ObjectsManager;
