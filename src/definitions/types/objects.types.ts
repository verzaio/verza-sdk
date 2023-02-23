import {Euler, Quaternion, Vector3} from 'three';

import type {ObjectDto, ObjectMetadataDto} from 'engine/generated/dtos.types';

import {
  EntityDrawDistance,
  EntityCollision,
  CreateEntityProps,
} from './entities.types';
import {QuaternionArray, Vector3Array} from './world.types';

export type ObjectType = ObjectDto['t'];

export type ObjectDataProps = CreateEntityProps &
  ObjectDto & {
    parent_id?: string;
  };

export type CreateObjectProps<T extends ObjectType = ObjectType> = {
  id?: string;

  parentId?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  drawDistance?: EntityDrawDistance;

  collision?: EntityCollision;

  scale?: number;

  shadows?: boolean;

  data?: ObjectMetadataDto[T];
};

export type CreateObjectPropsWithObjects<T extends ObjectType = ObjectType> =
  CreateObjectProps<T> & {
    // objects
    group?: ObjectMetadataDto['group'];
    model?: ObjectMetadataDto['model'];
    box?: ObjectMetadataDto['box'];
    line?: ObjectMetadataDto['line'];
    gltf?: ObjectMetadataDto['gltf'];
  };

export type ObjectBoundingBox = {
  min: Vector3Array;
  max: Vector3Array;
};

export type ObjectEditMode = 'position' | 'rotation' | 'scale';

export type ObjectEditActionType =
  | 'select'
  | 'unselect'
  | 'start'
  | 'update'
  | 'end';

export type ObjectEditAxes = Partial<{
  showX: boolean;
  showY: boolean;
  showZ: boolean;

  showRX: boolean;
  showRY: boolean;
  showRZ: boolean;

  showSX: boolean;
  showSY: boolean;
  showSZ: boolean;
}>;
