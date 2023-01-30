import {Quaternion, Vector3} from 'three';

import type {BasicObjectDto, ObjectMetadataDto} from 'types/Dto';

import {EntityDrawDistance, EntityPhysics} from './entities.types';
import {QuaternionArray, VectorArray} from './world.types';

export type ObjectType = BasicObjectDto['t'];

export type CreateObjectProps<T extends ObjectType> = {
  id?: string;

  position?: Vector3 | VectorArray;

  rotation?: Quaternion | QuaternionArray;

  drawDistance?: EntityDrawDistance;

  physics?: EntityPhysics;

  scale?: number;

  shadows?: boolean;

  data?: ObjectMetadataDto[T];
};
