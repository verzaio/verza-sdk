import {Color} from 'three';

import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {EntityType} from '../enums/entities.enums';
import {ObjectDataProps} from './objects/objects.types';

export type Vector2Array = [x: number, y: number];

export type Vector3Array = [x: number, y: number, z: number];

export type EulerArray = [x: number, y: number, z: number];

export type QuaternionArray = [x: number, y: number, z: number, w: number];

export type InteresectionData<T> = {
  distance: number;
  point: Vector3Array;
  faceIndex?: number;
  entity: T;
};

export type IntersectsResultRaw = {
  hit?: {
    distance: number;
    point: Vector3Array;
    faceIndex?: number;
  };

  object?: InteresectionData<string> & {
    data: ObjectDataProps;
  };

  player?: InteresectionData<number>;
};

export type IntersectsResult = {
  hit?: IntersectsResultRaw['hit'];

  object?: InteresectionData<ObjectManager>;

  player?: InteresectionData<PlayerManager>;
};

export type RaycastOptions = {
  entityTypes?: (keyof typeof EntityType)[];

  excludePlayers?: number[];

  excludeObjects?: string[];
};

export type DayPresets = 'sunrise' | 'day' | 'sunset' | 'night';

export type DayPresetInfo = {
  groundColor: Color;
  color: Color;
  lightColor: Color;
  intensity: number;
};

export type MoonPhases =
  | 'NEW_MOON'
  | 'WAXING_CRESCENT'
  | 'FIRST_QUARTER'
  | 'WAXING_GIBBOUS'
  | 'FULL_MOON'
  | 'WANING_GIBBOUS'
  | 'LAST_QUARTER'
  | 'WANING_CRESCENT';
