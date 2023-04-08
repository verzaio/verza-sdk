import {
  EntityColliderType,
  EntityCollisionType,
  EntityDrawDistanceType,
} from '../entities.types';
import {ColorType} from '../ui.types';
import {Boolean3Array, QuaternionArray, Vector3Array} from '../world.types';
import {ObjectStandardMaterial} from './objects-materials.types';
import {ObjectType} from './objects.types';

export type PickObject<T extends ObjectType> = ObjectTypes[T];

export type ObjectDataBase = {
  userData?: {
    [name: string]: unknown;
  };
};

export type ObjectBaseType<T extends ObjectType = ObjectType, D = unknown> = {
  id?: string; // id

  parent_id?: string; // parent

  t: T; // type

  o: ObjectDataBase & D; // object data

  dd?: EntityDrawDistanceType;

  p?: Vector3Array; // position

  r?: QuaternionArray | Vector3Array; // rotation

  s?: Vector3Array; // scale

  d?: number; // dimension

  ss?: boolean; // shadows

  c?: EntityCollisionType | null; // collision

  cc?: EntityColliderType | null; // collider

  m?: number; // mass

  ff?: number; // friction

  rr?: number; // restitution

  er?: Boolean3Array; // enabled rotations

  et?: Boolean3Array; // enabled translations

  po?: boolean; // permanent object

  ro?: boolean; // remote object
};

export type ObjectGroupType = ObjectBaseType<
  'group',
  {
    c?: ObjectTypeValues[];
  }
>;

export type ObjectModelType = ObjectBaseType<
  'model',
  {
    model: string; // model id

    data?: unknown; // data
  }
>;

export type ObjectGltfType = ObjectBaseType<
  'gltf',
  {
    u: string;
  }
>;

export type ObjectBoxType = ObjectBaseType<
  'box',
  {
    width?: number; // width

    height?: number; // height

    depth?: number; // depth

    widthSegments?: number; // widthSegments

    heightSegments?: number; // widthSegments

    depthSegments?: number; // depthsegments

    radius?: number; // border radius

    color?: ColorType; // color

    material?: ObjectStandardMaterial;
  }
>;

export type ObjectSphereType = ObjectBaseType<
  'sphere',
  {
    radius?: number; // radius

    heightSegments?: number; // height

    widthSegments?: number; // depth

    color?: ColorType; // color

    material?: ObjectStandardMaterial;
  }
>;

export type ObjectLineType = ObjectBaseType<
  'line',
  {
    points: Vector3Array[];

    color?: ColorType;
  }
>;

export type ObjectTextType = ObjectBaseType<
  'text',
  {
    text: string;

    color?: ColorType;

    fontSize?: number;

    maxWidth?: number;

    lineHeight?: number;

    letterSpacing?: number;

    textAlign?: 'center' | 'left' | 'right' | 'justify';

    font?: string;

    anchorX?: number | 'center' | 'left' | 'right';

    anchorY?:
      | number
      | 'bottom'
      | 'top'
      | 'middle'
      | 'top-baseline'
      | 'bottom-baseline';

    direction?: 'auto' | 'ltr' | 'rtl';

    overflowWrap?: 'normal' | 'break-word';

    whiteSpace?: 'normal' | 'nowrap' | 'overflowWrap';

    outlineWidth?: string | number;

    outlineOffsetX?: string | number;

    outlineOffsetY?: string | number;

    outlineBlur?: string | number;

    outlineColor?: ColorType;

    outlineOpacity?: number;

    strokeWidth?: string | number;

    strokeColor?: ColorType;

    strokeOpacity?: number;

    fillOpacity?: number;
  }
>;

export type ObjectTypes = {
  group: ObjectGroupType;

  model: ObjectModelType;

  box: ObjectBoxType;

  sphere: ObjectSphereType;

  line: ObjectLineType;

  gltf: ObjectGltfType;

  text: ObjectTextType;
};

export type ObjectTypeValues<T extends ObjectTypes = ObjectTypes> = T[keyof T];
