import {Euler, Quaternion, Vector3} from 'three';

import {
  EntityColliderType,
  EntityCollisionType,
  EntityDrawDistanceType,
} from 'engine/definitions/types/entities.types';
import {PickObject} from 'engine/definitions/types/objects/objects-definition.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {
  Boolean3Array,
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';

import {ObjectEventMapList} from './events.types';

export type ComponentObjectProps<T extends ObjectType = ObjectType> = Omit<
  ObjectEventMapList<T> & CreateObjectProps<T>,
  'type'
>;

export type CreateObjectProps<T extends ObjectType = ObjectType> = {
  id?: string;

  type?: ObjectType;

  parentId?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  scale?: Vector3 | Vector3Array | number;

  drawDistance?: EntityDrawDistanceType;

  dimension?: number;

  collision?: EntityCollisionType | null;

  collider?: EntityColliderType | null;

  mass?: number;

  friction?: number;

  restitution?: number;

  enabledRotations?: Boolean3Array;

  enabledTranslations?: Boolean3Array;

  shadows?: boolean;
} & PickObject<T>['o'];
