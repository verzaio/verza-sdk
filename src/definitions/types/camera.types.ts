import {PerspectiveCamera, Vector3} from 'three';

import EASINGS from '../constants/easings.constants';
import {CameraMode} from '../enums/camera.enums';
import {Vector3Array} from './world.types';

export type CameraModeType = keyof typeof CameraMode;

export type CameraPosition = {
  to: Vector3 | Vector3Array;
  lookAt?: Vector3 | Vector3Array;
};

export type CameraTransition<T extends string = keyof typeof EASINGS> =
  CameraPosition & {
    id?: number | string;
    from?: Vector3 | Vector3Array;
    lookAtFixed?: boolean;
    duration?: number;
    easing?: T;
  };

export type CameraTransitionItem = CameraTransition & {
  startTime: number;
  originPosition: PerspectiveCamera;
};
