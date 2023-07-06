import {Vector3} from 'three';

import EASINGS from '../constants/easings.constants';
import {ColorType} from './ui.types';
import {Vector3Array} from './world.types';

export type EffectEasing = keyof typeof EASINGS;

export type EffectLoop = 'once' | 'repeat';

export type EffectShape = 'square' | 'sphere';

export type EffectDirection = 'in' | 'out' | 'in-out';

export type EffectCubicBezier = [
  x1: number,
  y1: number,
  x2: number,
  y2: number,
];

export type ColorSequenceStep<T = ColorType> = {
  time: number;
  value: T;
  opacity?: number;
};

export type NumberSequenceStep = {
  time: number;
  value: number;
};

export type EffectType = EffectEasing | EffectCubicBezier;

export type EffectValueRange = [min: number, max: number];

export type ParticleOptions = {
  texture?: string;

  autoplay?: boolean;

  flipbookFrames?: number;

  shape?: EffectShape;

  position?: Vector3Array | Vector3;

  direction?: EffectDirection | Vector3Array | Vector3;

  color?: ColorType | ColorSequenceStep[];

  bloom?: boolean; // not working yet

  amount?: number;

  lifetime?: number;

  distance?: number;

  radius?: number;

  phi?: number | EffectValueRange;

  theta?: number | EffectValueRange;

  delay?: number;

  spreadAngle?: number;

  size?: number | EffectValueRange;

  zoom?: EffectValueRange;

  timeEffect?: EffectType | null;

  opacity?: number | EffectValueRange;

  transparency?: number | EffectValueRange;

  velocity?: number | EffectValueRange;

  loop?: EffectLoop;

  repetitions?: number | null;

  autoDestroy?: boolean;
};
