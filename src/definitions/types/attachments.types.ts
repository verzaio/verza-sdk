import {Euler, Quaternion, Vector3} from 'three';

import {CharacterBone} from './bones.types';
import {EulerArray, QuaternionArray, Vector3Array} from './world.types';

export type EntityAttachOptions = {
  bone?: CharacterBone;
  position?: Vector3Array | Vector3;
  rotation?: EulerArray | QuaternionArray | Euler | Quaternion;
};
