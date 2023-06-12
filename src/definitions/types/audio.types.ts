import {Vector3} from 'three';

import {ArrayValues} from 'engine/definitions/types/helpers.types';
import {Vector3Array} from 'engine/definitions/types/world.types';

import {SOUNDS_LIST} from '../constants/audio.constants';

export type SoundName = ArrayValues<typeof SOUNDS_LIST>;

export type SoundItem = {
  soundName: string;
  url: string;
};

export type SoundLoop = 'once' | 'repeat';

export type SoundOptions = {
  volume?: number;
  autoplay?: boolean;
  playbackRate?: number;
  loop?: SoundLoop;
  loopStart?: number;
  loopEnd?: number;
  position?: Vector3 | Vector3Array;
  minDistance?: number;
  maxDistance?: number;
  rolloffFactor?: number;
  autoDestroy?: boolean;
  objectId?: string;
};

export type SoundEventType = 'ended';

export type SoundEvent = {
  id: string;
  type: SoundEventType;
  soundName: string;
  objectId?: string;
};
