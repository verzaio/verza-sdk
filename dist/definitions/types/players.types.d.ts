import type { ANIMATIONS } from '../../definitions/constants/animations.constants';
import type { Vector3Array } from '../../definitions/types/world.types';
import type { CharacterDto } from '../../generated/dtos.types';
import type { PlayerStateEnum } from '../enums/players.enums';
export type PlayerAnimsList = keyof typeof ANIMATIONS;
export type PlayerState = keyof typeof PlayerStateEnum;
export type CharacterGender = 'male' | 'female';
export type PlayerDataProps = {
    name?: string;
    state?: PlayerState;
    stateAnimIndex?: number;
    velocity?: Vector3Array;
    controls?: boolean;
    character?: CharacterDto;
    roles?: string[];
};
export type PlayerCameraDistance = 'short' | 'normal' | 'long';
export type PlayerCameraConfig = {
    distance: number;
    height: number;
    headPitch: number;
};
