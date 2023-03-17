import {Euler, Object3D, Quaternion, Vector3} from 'three';

import {
  EulerArray,
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';

const _OBJECT = new Object3D();

export const toVector3Array = (
  position: Vector3 | Vector3Array,
): Vector3Array => {
  if ((position as Vector3).isVector3) {
    return (position as Vector3).toArray();
  }

  return position as Vector3Array;
};

export const toQuaternionArray = (
  rotation: Quaternion | Euler | QuaternionArray | EulerArray,
): QuaternionArray => {
  return toQuaternion(rotation).toArray() as QuaternionArray;
};

export const toQuaternion = (
  rotation: Quaternion | Euler | QuaternionArray | EulerArray,
): Quaternion => {
  if (Array.isArray(rotation)) {
    // Vector3Array
    if (rotation.length === 3) {
      _OBJECT.rotation.set(...rotation);
    } else {
      // QuaternionArray
      _OBJECT.quaternion.set(...rotation);
    }
  } else {
    // Euler
    if (rotation instanceof Euler) {
      _OBJECT.rotation.copy(rotation);
    } else {
      // Quaternion
      _OBJECT.quaternion.copy(rotation);
    }
  }

  return _OBJECT.quaternion;
};
