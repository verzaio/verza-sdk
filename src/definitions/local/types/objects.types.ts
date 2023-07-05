import {Euler, Quaternion, Vector3} from 'three';

import {SoundOptions} from 'engine/definitions/types/audio.types';
import {
  EntityColliderType,
  EntityCollisionType,
  EntityDrawDistanceType,
} from 'engine/definitions/types/entities.types';
import {PickObject} from 'engine/definitions/types/objects/objects-definition.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {
  Boolean3Array,
  ProximityAction,
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {ParticlesOptions} from 'engine/types';

import {ObjectEventMapList} from './events.types';

export type ComponentObjectProps<T extends ObjectType = ObjectType> = Omit<
  ObjectEventMapList<T> & CreateObjectProps<T>,
  'type'
> & {
  soundName?: string;

  soundOptions?: SoundOptions;

  proximityAction?: Omit<ProximityAction, 'id' | 'objectId'> | boolean;

  particles?: ParticlesOptions | boolean;

  helper?: boolean;
};

export type CreateObjectProps<T extends ObjectType = ObjectType> = {
  id?: string;

  type?: ObjectType;

  parentId?: string;

  position?: Vector3 | Vector3Array;

  rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;

  scale?: Vector3 | Vector3Array | number;

  drawDistance?: EntityDrawDistanceType | null;

  dimension?: number;

  collision?: EntityCollisionType | null;

  collider?: EntityColliderType | null;

  sensor?: boolean;

  mass?: number;

  friction?: number;

  restitution?: number;

  enabledRotations?: Boolean3Array;

  enabledTranslations?: Boolean3Array;

  shadows?: boolean;

  renderOrder?: number;
} & PickObject<T>['o'];
