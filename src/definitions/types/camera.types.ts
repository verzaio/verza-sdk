import {PerspectiveCamera, Vector3} from 'three';

import EASINGS from '../constants/easings.constants';
import {CameraMode} from '../enums/camera.enums';
import {VectorArray} from './world.types';

export type CameraModeType = keyof typeof CameraMode;

export type CameraPosition = {
  to: Vector3 | VectorArray;
  lookAt?: Vector3 | VectorArray;
};

export type CameraTransition = CameraPosition & {
  id?: number | string;
  from?: Vector3 | VectorArray;
  lookAtFixed?: boolean;
  duration?: number;
  easing?: keyof typeof EASINGS;
};

export type CameraTransitionItem = CameraTransition & {
  startTime: number;
  originPosition: PerspectiveCamera;
};
