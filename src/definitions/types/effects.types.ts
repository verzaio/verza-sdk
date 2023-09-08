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

export type ParticlesOptions = {
  /**
   * The texture URL or Asset ID to use for the particle.
   *
   * By default, the texture used will be a circle.
   *
   * @default null
   */
  texture?: string;

  /**
   * Start the particle animation on load.
   *
   * @default true
   */
  autoplay?: boolean;

  /**
   * If set, the texture will be treated as a flipbook animation.
   * If set to 0, the texture will be treated as a single frame.
   *
   * Flipbook must be a square texture with a number of frames that is a perfect square.
   *
   * @default 0
   */
  flipbookFrames?: number;

  /**
   * The shape of the particle emitter.
   *
   * `square` will emit particles in a square shape.
   * `sphere` will emit particles in a sphere shape (using `phi` and `theta` angles you will be able to control the shape of the sphere).
   *
   * @default square
   */
  shape?: EffectShape;

  /**
   * The position of the particle emitter.
   *
   * When attached to an entity, the position will be relative to the entity.
   *
   * @default [0, 0, 0]
   */
  position?: Vector3Array | Vector3;

  /**
   * The direction of the particle emitter.
   *
   * `in` - will emit particles from the center of the emitter to the edge.
   * `out` - will emit particles from the edge of the emitter to the center.
   * `in-out` - will emit particles from the center of the emitter to the edge and back to the center.
   * `Vector3` - will emit particles in the direction of the vector.
   *
   * `in`, `out` and `in-out` only work when shape is set to `sphere`.
   *
   * @default [0, 1, 0]
   */
  direction?: EffectDirection | Vector3Array | Vector3;

  /**
   * The color of the particle.
   *
   * - If a ColorType is provided, the particle will be a solid color.
   * - If a ColorSequenceStep array is provided, a color transition will be applied to the particle.
   *
   * @default #2b00ff (blue)
   */
  color?: ColorType | ColorSequenceStep[];

  /**
   * The bloom color of the particle.
   *
   * @default false
   */
  bloom?: boolean; // not working yet

  /**
   * The number of particles to emit per loop.
   *
   * @default 25
   */
  amount?: number;

  /**
   * The lifetime of the particle in seconds.
   *
   * @min 0
   * @max 20
   *
   * @default 1
   */
  lifetime?: number;

  /**
   * The distance the particle will travel.
   *
   * default: 1
   */
  distance?: number;

  /**
   * The radius of the particle emitter.
   *
   * When shape is set to 'square', this will be the width and depth of the square.
   * When shape is set to 'sphere', this will be the radius of the sphere.
   *
   * @default 0.5
   */
  radius?: number;

  /**
   * The phi angle of the particle emitter.
   *
   * This is only used when shape is set to 'sphere'.
   *
   * @default [0, Math.PI]
   */
  phi?: number | EffectValueRange;

  /**
   * The theta angle of the particle emitter.
   *
   * This is only used when shape is set to 'sphere'.
   *
   * @default [0, Math.PI * 2]
   */
  theta?: number | EffectValueRange;

  /**
   * The delay before the particle animation starts.
   *
   * The delay will be randomized between 0 and the value provided.
   *
   * The value provided is relative to the lifetime of the particle.
   *
   * @min 0
   * @max 1
   *
   * @default 1
   */
  delay?: number;

  /**
   * The spread angle of the particle emitter.
   *
   * This is only used when direction is using a Vector3.
   *
   * @min 0
   * @max 90
   *
   * @default 0
   */
  spreadAngle?: number;

  /**
   * The size of the particle.
   *
   * If a range is provided, the size will be randomized between the min and max values.
   *
   * @min 0
   * @max 64
   *
   * @default [0.5, 1]
   */
  size?: number | EffectValueRange;

  /**
   * The zoom effect of the particle.
   *
   * This will zoom-in and zoom-out the particle.
   *
   * `min` indicates when the particles will be ending its zoom-in animation.
   * `max` indicates when the particles will be starting its zoom-out animation.
   *
   * @min 0
   * @max 1
   *
   * @default [0.3, 0.7]
   */
  zoom?: EffectValueRange;

  /**
   * The timeEffect of the particle.
   *
   * @default linear
   */
  timeEffect?: EffectType | null;

  /**
   * The opacity of the particle.
   *
   * If a range is provided, the opacity will be randomized between the min and max values.
   *
   * @min 0
   * @max 1
   *
   * @default 1
   */
  opacity?: number | EffectValueRange;

  /**
   * The transparency of the particle.
   *
   * This will make the particle fade in and fade out.
   *
   * `min` indicates when the particles will be ending its fade-in animation.
   * `max` indicates when the particles will be starting its fade-out animation.
   *
   * @min 0
   * @max 1
   *
   * @default [0.3, 0.7]
   */
  transparency?: number | EffectValueRange;

  /**
   * The velocity of the particle.
   *
   * If a range is provided, the velocity will be randomized between the min and max values.
   *
   * The values provided are relative to the lifetime of the particle.
   *
   * @default [1, 1.5]
   */
  velocity?: number | EffectValueRange;

  /**
   * The loop of the particle.
   *
   * `once` will play the particle animation once.
   * `repeat` will play the particle animation repeatedly based on the repetitions.
   *
   * @default repeat
   */
  loop?: EffectLoop;

  /**
   * The repetitions of the particle.
   *
   * If set to `null` or `0`, the particle will loop forever.
   *
   * If `autoDestroy` is set to `true`, the particle will be destroyed after the repetitions are completed.
   *
   * @default null
   */
  repetitions?: number | null;

  /**
   * The autoDestroy of the particle.
   *
   * If set to `true`, the particle will be destroyed after the repetitions
   * are completed if  or the particle is stopped.
   *
   * @default false
   */
  autoDestroy?: boolean;
};
