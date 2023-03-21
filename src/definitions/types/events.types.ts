import {PlayerPacketUpdateDto} from 'engine/generated/dtos.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import type {EntityType} from '../enums/entities.enums';
import {CameraModeType} from './camera.types';
import {ChunkIndex} from './chunks.types';
import {PlayerControls} from './controls.types';
import type {PlayerState, CharacterGender} from './players.types';
import {KeyEvent, PointerEvent} from './ui.types';

export type EventKey =
  | 'ENGINE'
  | 'WORLD'
  | 'NETWORK'
  | 'CHUNK'
  | `CHUNK.${number}`
  | `${EntityType}`
  | `${EntityType}.${string | number}`;

export type EngineEventMap = {
  onReady: () => void;

  onDestroy: () => void;

  DEBUG_onPlayerPacket: (packet: PlayerPacketUpdateDto) => void;
};

export type CameraEventMap = {
  onCameraModeChange: (mode: CameraModeType, instant?: boolean) => void;
};

export type ChunkEventMap = {
  [key in `onEnter_${ChunkIndex}`]: () => void;
} & {
  [key in `onLeave_${ChunkIndex}`]: (chunkIndex: ChunkIndex) => void;
} & {
  [key in `onEnter_${ChunkIndex}_${number}`]: () => void;
} & {
  [key in `onLeave_${ChunkIndex}_${number}`]: () => void;
} & {
  onEnter: (chunkIndex: ChunkIndex) => void;
  onLeave: (chunkIndex: ChunkIndex) => void;
};

export type NetworkEventMap = {
  onServerChange: () => void;
};

export type EntityEventMap<T> = {
  onCreate: (entity: T) => void;
  onDestroy: (entity: T) => void;

  onEnter: (entity: T) => void;
  onLeave: (entity: T) => void;

  onStreamIn: (entity: T) => void;
  onStreamOut: (entity: T) => void;

  onChunkIndexChange: (entity: T, chunkIndex: ChunkIndex) => void;
};

export type PlayerEventMap = {
  onGenderChange: (gender: CharacterGender) => void;

  onControlChange: (
    control: keyof PlayerControls,
    newState: boolean,
    oldState: boolean,
  ) => void;

  onStateChange: (
    newState: PlayerState | null,
    oldState: PlayerState | null,
  ) => void;

  onStateAnimationChange: (anim: number) => void;

  onHeadMove: (euler: [number, number, number]) => void;

  onClothesUpdate: () => void;
};

export type ObjectEventMap = {
  onChildAdded: (children: ObjectManager) => void;

  onChildRemoved: (children: ObjectManager) => void;
};

export type ChatEventMap = {
  onChat: (text: string) => void;
};

export type UIEventMap = {
  onPointerEvent: (event: PointerEvent) => void;

  onPointerMove: (event: PointerEvent) => void;

  onPointerDown: (event: PointerEvent) => void;

  onPointerUp: (event: PointerEvent) => void;

  onKeyEvent: (event: KeyEvent) => void;

  onKeyDown: (event: KeyEvent) => void;

  onKeyUp: (event: KeyEvent) => void;

  onToolbarItemPress: (id: string, toolbarId: string) => void;
};
