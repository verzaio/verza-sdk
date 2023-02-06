import {PlayerPacketUpdateDto} from 'engine/generated/dtos.types';

import {
  PlayerCameraConfig,
  PlayerCameraDistance,
  PlayerState,
} from '../types/players.types';

export const PLAYER_NAMETAG_DISTANCE = 18;

export const PLAYER_TICKS_PER_SECOND = 40;

export const CHARACTER_MASS = 80; // KG

export const CHARACTER_HEIGHT = 1.76; // METERS

export const CHARACTER_RADIUS = 0.24; // METERS

export const CHARACTER_BODY_NAME = 'Body';

export const CHARACTER_EYES_NAME = 'Eyes';

export const CHARACTER_ROOT_BONE_NAME = 'root';

export const CHARACTER_HEAD_BONE_NAME = 'head';

export const PLAYER_STATE_PACKET: Record<PlayerState, number> = {
  idle: 0,
  dead: 1,
  walking: 2,
  running: 3,
  jumping: 4,
  falling: 5,
};

export const PLAYER_STATE_PACKET_INDEX = Object.entries(
  PLAYER_STATE_PACKET,
).reduce((anims, anim) => {
  anims[anim[1]] = anim[0] as keyof typeof PLAYER_STATE_PACKET;
  return anims;
}, {} as Record<number, PlayerState>);

export const PLAYER_STATE_PACKET_KEYS: (keyof PlayerPacketUpdateDto)[] = [
  'n',
  's',
  'p',
  'r',
  'h',
  'v',
];

export const PLAYER_CAMERA_CONFIGS: Record<
  PlayerCameraDistance,
  PlayerCameraConfig
> = {
  short: {
    distance: 1, // 2.1
    height: 1.6,
    headPitch: -0.1,
  },
  normal: {
    distance: 3.5,
    height: 1.5,
    headPitch: -0.1,
  },
  long: {
    distance: 4.8,
    height: 2.5,
    headPitch: -0.1,
  },
};
