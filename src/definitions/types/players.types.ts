import type {ANIMATIONS} from 'engine/definitions/constants/animations.constants';
import type {VectorArray} from 'engine/definitions/types/world.types';

import type {CharacterDto} from 'types/Dto';

import type {PlayerStateEnum} from '../enums/players.enums';

export type PlayerAnimsList = keyof typeof ANIMATIONS;

export type PlayerState = keyof typeof PlayerStateEnum;

export type CharacterGender = 'male' | 'female';

export type PlayerControls = {
  // movement
  forward: boolean;
  left: boolean;
  backward: boolean;
  right: boolean;
  space: boolean;

  // others
  tab: boolean;
  caps: boolean;
  shift: boolean;
  alt: boolean;
  control: boolean;
  f10: boolean;
};

export type PlayerDataProps = {
  name?: string;

  state?: PlayerState;

  stateAnimIndex?: number;

  velocity?: VectorArray;

  controls?: boolean;

  character?: CharacterDto;
};

export type CameraDistance = 'short' | 'normal' | 'long';

export type CameraConfig = {
  distance: number;
  height: number;
  headPitch: number;
};