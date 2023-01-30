import {Euler, Quaternion, Vector3} from 'three';

import type {BasicObjectDto, ObjectMetadataDto} from 'types/Dto';

import {EntityDrawDistance, EntityCollision} from './entities.types';
import {QuaternionArray, Vector3Array} from './world.types';

export type ObjectType = BasicObjectDto['t'];

export type CreateObjectProps<T extends ObjectType> = {
  id?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  drawDistance?: EntityDrawDistance;

  collision?: EntityCollision;

  scale?: number;

  shadows?: boolean;

  data?: ObjectMetadataDto[T];
};
