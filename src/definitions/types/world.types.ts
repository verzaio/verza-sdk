import {Vector3} from 'three';

import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {TIMEZONES_LIST} from '../constants/timezones.constants';
import {EntityType} from '../enums/entities.enums';
import {ObjectDataProps} from './objects/objects.types';
import {KeyEvent} from './ui.types';

export type Boolean3Array = [x: boolean, y: boolean, z: boolean];

export type Vector2Array = [x: number, y: number];

export type Vector3Array = [x: number, y: number, z: number];

export type EulerArray = [x: number, y: number, z: number];

export type QuaternionArray = [x: number, y: number, z: number, w: number];

export type WorldEventMap = {
  onProximityActionsUpdated: () => void;
};

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
    normal: Vector3Array;
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
  filterEntityTypes?: (keyof typeof EntityType)[];

  excludePlayerIds?: number[];

  excludeObjectIds?: string[];

  collidableOnly?: boolean;
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

export type SkyboxProps =
  | {
      url: string;
      isHdr?: boolean;
    }
  | {
      right: string;
      left: string;
      top: string;
      bottom: string;
      front: string;
      back: string;
    }
  | {
      px: string;
      nx: string;
      py: string;
      ny: string;
      pz: string;
      nz: string;
    };

export type Timezone = (typeof TIMEZONES_LIST)[number];

export type TimeMode = 'fixed' | 'cycle' | 'timezone';

export type WeatherType = 'clear' | 'neutral' | 'cloudy';

export type RenderResolution =
  | 0.5
  | 0.75
  | 1
  | 1.25
  | 1.5
  | 1.75
  | 2
  | 'native';

export type ViewportRender =
  | 'render'
  | 'solid'
  | 'wireframe'
  | 'wireframe-normal'
  | 'normal';

export type ProximityAction = {
  id: string;
  objectId?: string;
  position?: Vector3 | Vector3Array;
  label?: string;
  description?: string;
  key?: string;
  distance?: number;
};

export type ProximityActionEvent = KeyEvent & {
  actionId: string;
  objectId?: string;
};
