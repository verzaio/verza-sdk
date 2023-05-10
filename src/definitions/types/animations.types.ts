export type AnimationLoop = 'once' | 'repeat' | 'pingpong';

export type AnimationInfo = {
  id: string;
  duration: number;
};

export type AnimationOptions = {
  randomStart?: boolean;
  startAt?: number;
  duration?: number;
  weight?: number;
  loop?: AnimationLoop;
  repetitions?: number;
  speed?: number;
  paused?: boolean;
  stopAtLastFrame?: boolean;
  fadeInDuration?: number;
};

export type AnimationEventType = 'loop' | 'finished';

export type AnimationEvent = {
  id: string;
  loopDelta: number;
  type: AnimationEventType;
};
