import type {EntityType} from '../enums/entities.enums';
import {ControlType} from './camera.types';
import {ChunkIndex} from './chunks.types';
import {CommandInfo} from './commands.types';
import type {
  PlayerControls,
  PlayerState,
  CharacterGender,
} from './players.types';
import {KeyInfo} from './ui.types';

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

  onControlChange: (type: ControlType) => void;
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
  onRegister: (event: string) => void;

  onUnregister: (event: string) => void;

  /* engine */
  onSetPlayerId: (playerId: number) => void;

  onFrame: (delta: number) => void;

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
};
