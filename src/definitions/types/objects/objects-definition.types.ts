import {ObjectDataDto} from 'engine/generated/dtos.types';

import {EntityCollision} from '../entities.types';
import {QuaternionArray, Vector3Array} from '../world.types';
import {ObjectType} from './objects.types';

export type PickObject<T extends ObjectType> = ObjectTypes[T];

export type ObjectBaseType<
  T extends ObjectType = ObjectType,
  D = unknown,
> = Omit<ObjectDataDto, 'p' | 'r' | 'c' | 't'> & {
  id?: string;
  parent_id?: string;
  t: T;
  o: D;

  c?: EntityCollision | null;

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
    m: string; // model id

    d?: unknown; // data
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
    w: number; // width

    h: number; // height

    d: number; // depth

    ws?: number; // widthSegments

    hs?: number; // widthSegments

    ds?: number; // depthsegments

    c?: string; // color
  }
>;

export type ObjectLineType = ObjectBaseType<
  'line',
  {
    p: Vector3Array[];

    c?: string;
  }
>;

export type ObjectTypes = {
  group: ObjectGroupType;

  model: ObjectModelType;

  box: ObjectBoxType;

  line: ObjectLineType;

  gltf: ObjectGltfType;
};

export type ObjectTypeValues<T extends ObjectTypes = ObjectTypes> = T[keyof T];
