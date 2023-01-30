import {ObjectBoxDto, PlayerPacketDto, PlayerPacketUpdateDto} from 'types/Dto';

import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import type {EntityType} from '../enums/entities.enums';
import {CameraModeType, CameraPosition, CameraTransition} from './camera.types';
import {ChunkIndex} from './chunks.types';
import {CommandInfo} from './commands.types';
import {CreateObjectProps} from './objects.types';
import type {
  PlayerControls,
  PlayerState,
  CharacterGender,
} from './players.types';
import {KeyInfo} from './ui.types';
import {QuaternionArray, Vector3Array} from './world.types';

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
};

export type CameraEventMap = {
  onCameraModeChange: (mode: CameraModeType, instant?: boolean) => void;

  onCameraTransitionStart: (id?: number | string) => void;

  onCameraTransitionEnd: (id?: number | string) => void;
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
};

export type PlayerEventMap = {
  onGenderChange: (gender: CharacterGender) => void;

  onInputChange: (
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
};

export type ChatEventMap = {
  onChat: (text: string) => void;
};

/* scripts */
export type SizePropValue = `${number}vh` | `${number}vw` | `${number}px`;

export type SizeProps = {
  height: SizePropValue;
  width: SizePropValue;
  left?: SizePropValue;
  top?: SizePropValue;
  right?: SizePropValue;
  bottom?: SizePropValue;
};

export type ScriptEventMap = {
  /* messenger */
  onRegister: (eventName: string) => void;
  onUnregister: (eventName: string) => void;

  /* engine */
  onSetPlayerId: (playerId: number) => void;

  onFrame: (delta: number) => void;

  onSynced: () => void;

  /* chat */
  onChat: (text: string) => void;

  onSendMessage: (text: string) => void;

  onCommand: (command: string) => void;

  onCommandNotFound: (command: string) => void;

  onAddCommand: (command: CommandInfo) => void;

  onRemoveCommand: (command: string) => void;

  /* ui */
  onKey: (keyInfo: KeyInfo) => void;

  onAddInterface: (tag: string) => void;

  onRemoveInterface: (tag: string) => void;

  onCursorLock: (status: boolean) => void;

  onSetSize: (props: SizeProps) => void;

  onShow: () => void;

  onHide: () => void;

  /* players */
  onPlayerUpdate: (
    entityId: number,
    update: PlayerPacketDto | PlayerPacketUpdateDto,
  ) => void;

  onPlayerCreate: (
    playerId: number,
    data?: PlayerManager['data'],
    streamed?: boolean,
  ) => void;

  onPlayerDestroy: (playerId: number) => void;

  onPlayerStreamIn: (playerId: number, data?: PlayerManager['data']) => void;

  onPlayerStreamOut: (playerId: number) => void;

  setPlayerName: (playerId: number, name: string) => void;

  setPlayerPosition: (
    playerId: number,
    position: Vector3Array,
    instant?: boolean,
  ) => void;

  setPlayerRotation: (
    playerId: number,
    rotation: QuaternionArray | Vector3Array,
    instant: boolean,
  ) => void;

  setPlayerFacingAngle: (
    playerId: number,
    degrees: number,
    instant: boolean,
  ) => void;

  setPlayerCameraBehind: (playerId: number) => void;

  /* camera */
  onCameraModeChange: (mode: CameraModeType, instant?: boolean) => void;

  setCameraTransitions: (transitions: CameraTransition[]) => void;

  setCameraTransition: (transition: CameraTransition) => void;

  setCameraPosition: (position: CameraPosition) => void;

  onCameraTransitionStart: (id?: number | string) => void;

  onCameraTransitionEnd: (id?: number | string) => void;

  /* objects */
  createBox: (box: ObjectBoxDto, props?: CreateObjectProps<'box'>) => void;

  createLine: (
    points: Vector3Array[],
    color?: string,
    props?: CreateObjectProps<'line'>,
  ) => void;

  onCreateGltf: (url: string, props?: CreateObjectProps<'gltf'>) => void;

  setObjectPosition: (objectId: string, position: Vector3Array) => void;

  setObjectRotation: (
    objectId: string,
    rotation: QuaternionArray | Vector3Array,
  ) => void;

  destroyObject: (objectId: string) => void;
};
