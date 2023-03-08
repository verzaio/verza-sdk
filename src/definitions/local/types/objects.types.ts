import {Euler, Quaternion, Vector3} from 'three';

import {
  EntityColliderType,
  EntityCollisionType,
  EntityDrawDistanceType,
} from 'engine/definitions/types/entities.types';
import {PickObject} from 'engine/definitions/types/objects/objects-definition.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';

import {ObjectEventMapList} from './events.types';

export type ComponentObjectProps<T extends ObjectType = ObjectType> =
  ObjectEventMapList<T> & CreateObjectProps<T>;

export type CreateObjectProps<T extends ObjectType = ObjectType> = {
  id?: string;

  type?: ObjectType;

  parentId?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  scale?: Vector3 | Vector3Array;

  drawDistance?: EntityDrawDistanceType;

  dimension?: number;

  collision?: EntityCollisionType | null;

  collider?: EntityColliderType | null;

  mass?: number;

  shadows?: boolean;
} & PickObject<T>['o'];
