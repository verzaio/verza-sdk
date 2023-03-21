import type {ANIMATIONS} from 'engine/definitions/constants/animations.constants';
import type {Vector3Array} from 'engine/definitions/types/world.types';
import type {CharacterDto} from 'engine/generated/dtos.types';

import type {PlayerStateEnum} from '../enums/players.enums';
import {CreateEntityProps} from './entities.types';

export type PlayerAnimsList = keyof typeof ANIMATIONS;

export type PlayerState = keyof typeof PlayerStateEnum;

export type CharacterGender = 'male' | 'female';

export type PlayerDataProps = CreateEntityProps & {
  name?: string;

  state?: PlayerState;

  surfing?: number;

  stateAnimIndex?: number;

  velocity?: Vector3Array;

  controller?: boolean;

  character?: CharacterDto;

  roles?: string[];
};

export type PlayerCameraDistance = 'short' | 'normal' | 'long';

export type PlayerCameraConfig = {
  distance: number;
  height: number;
  headPitch: number;
};
