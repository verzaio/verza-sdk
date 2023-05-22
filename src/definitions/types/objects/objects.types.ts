import {Euler, Object3D, Quaternion, Vector3} from 'three';

import EASINGS from 'engine/definitions/constants/easings.constants';

import {ObjectType as ObjectTypeEnum} from '../../enums/objects.enums';
import {CreateEntityProps} from '../entities.types';
import {ColorType} from '../ui.types';
import {EulerArray, QuaternionArray, Vector3Array} from '../world.types';
import {ObjectBaseType} from './objects-definition.types';

export type ObjectBoundingBox = {
  min: Vector3Array;
  max: Vector3Array;
};

export type ObjectEditMode = 'position' | 'rotation' | 'scale';

export type ObjectEditActionType =
  | 'select'
  | 'unselect'
  | 'sync'
  | 'start'
  | 'update'
  | 'end';

export type ObjectEditTransform = {
  position: Vector3Array;
  rotation: QuaternionArray;
  scale: Vector3Array;
};

export type ObjectEditAxes = Partial<{
  showX: boolean;
  showY: boolean;
  showZ: boolean;

  showRX: boolean;
  showRY: boolean;
  showRZ: boolean;

  showSX: boolean;
  showSY: boolean;
  showSZ: boolean;
}>;

export type ObjectType = Lowercase<keyof typeof ObjectTypeEnum>;

export type ObjectDataProps = CreateEntityProps & ObjectBaseType;

export type ObjectTransition<T extends string = keyof typeof EASINGS> = {
  id?: number | string;
  to?: Vector3 | Vector3Array;
  toRotation?: Quaternion | Euler | QuaternionArray | EulerArray;
  from?: Vector3 | Vector3Array;
  fromRotation?: Quaternion | Euler | QuaternionArray | EulerArray;
  duration?: number;
  speed?: number;
  easing?: T;
  cubicBezier?: [x1: number, y1: number, x2: number, y2: number];
  loop?: boolean;
};

export type ObjectTransitionItem = ObjectTransition & {
  startTime: number;
  currentStep: number;
  steps: number;
  originPosition: Object3D;
  finalPosition: Object3D;
  easingFunction: (delta: number) => number;
};

export type ObjectHighlightType = 'box';

export type ObjectHighlightOptions = {
  type?: ObjectHighlightType;
  color?: ColorType;
};
