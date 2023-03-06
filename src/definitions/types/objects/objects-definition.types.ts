import {ObjectDataDto} from 'engine/generated/dtos.types';

import {EntityCollisionType, EntityDrawDistanceType} from '../entities.types';
import {QuaternionArray, Vector3Array} from '../world.types';
import {ObjectStandardMaterial} from './objects-materials.types';
import {ObjectType} from './objects.types';

export type PickObject<T extends ObjectType> = ObjectTypes[T];

export type ObjectDataBase = {
  userData?: {
    [name: string]: unknown;
  };
};

export type ObjectBaseType<
  T extends ObjectType = ObjectType,
  D = unknown,
> = Omit<ObjectDataDto, 'p' | 'r' | 'c' | 't'> & {
  id?: string;
  parent_id?: string;
  t: T;
  o: ObjectDataBase & D;

  c?: EntityCollisionType | null;

  dd?: EntityDrawDistanceType;

  p?: Vector3Array; // position
  r?: QuaternionArray | Vector3Array; // rotation
  s?: Vector3Array; // scale
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
    width: number; // width

    height: number; // height

    depth: number; // depth

    widthSegments?: number; // widthSegments

    heightSegments?: number; // widthSegments

    depthSegments?: number; // depthsegments

    color?: string; // color

    material?: ObjectStandardMaterial;
  }
>;

export type ObjectSphereType = ObjectBaseType<
  'sphere',
  {
    radius: number; // radius

    heightSegments?: number; // height

    widthSegments?: number; // depth

    color?: string; // color

    material?: ObjectStandardMaterial;
  }
>;

export type ObjectLineType = ObjectBaseType<
  'line',
  {
    points: Vector3Array[];

    color?: string;
  }
>;

export type ObjectTextType = ObjectBaseType<
  'text',
  {
    text: string;

    color?: string;

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

    outlineColor?: string;

    outlineOpacity?: number;

    strokeWidth?: string | number;

    strokeColor?: string;

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
