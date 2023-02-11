import type {ANIMATIONS} from 'engine/definitions/constants/animations.constants';
import type {Vector3Array} from 'engine/definitions/types/world.types';

import type {CharacterDto} from 'engine/generated/dtos.types';

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

  velocity?: Vector3Array;

  controls?: boolean;

  character?: CharacterDto;
};

export type PlayerCameraDistance = 'short' | 'normal' | 'long';

export type PlayerCameraConfig = {
  distance: number;
  height: number;
  headPitch: number;
};
