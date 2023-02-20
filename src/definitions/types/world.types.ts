import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {EntityType} from '../enums/entities.enums';
import {ObjectDataProps} from './objects.types';

export type Vector3Array = [x: number, y: number, z: number];

export type QuaternionArray = [x: number, y: number, z: number, w: number];

export type WorldPosition = [
  x: number,

  y: number,

  z: number,

  dimension: number,
];

export type WorldPositionRotation = [
  x: number,

  y: number,

  z: number,

  dimension: number,

  rx: number,

  ry: number,

  rz: number,

  rw?: number,
];

export type InteresectionData<T> = {
  distance: number;
  point: Vector3Array;
  faceIndex?: number;
  entity: T;
};

export type IntersectsResultRaw = {
  object?: InteresectionData<string> & {
    data: ObjectDataProps;
  };

  player?: InteresectionData<number>;
};

export type IntersectsResult = {
  object?: InteresectionData<ObjectManager>;

  player?: InteresectionData<PlayerManager>;
};

export type RaycastOptions = {
  entityTypes?: (keyof typeof EntityType)[];

  excludePlayers?: number[];

  excludeObjects?: string[];
};
