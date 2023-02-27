import {Euler, Quaternion, Vector3} from 'three';

import {
  EntityCollision,
  EntityDrawDistance,
} from 'engine/definitions/types/entities.types';
import {PickObject} from 'engine/definitions/types/objects/objects-definition.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';

export type CreateObjectProps<T extends ObjectType = ObjectType> = {
  id?: string;

  type?: ObjectType;

  parentId?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  scale?: Vector3 | Vector3Array;

  drawDistance?: EntityDrawDistance;

  dimension?: number;

  collision?: EntityCollision | null;

  shadows?: boolean;

  data?: PickObject<T>['o'];
};
