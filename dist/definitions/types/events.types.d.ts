import ObjectManager from '../../managers/entities/objects/object/object.manager';
import type { EntityType } from '../enums/entities.enums';
import { CameraModeType } from './camera.types';
import { ChunkIndex } from './chunks.types';
import { PlayerControls } from './controls.types';
import type { PlayerState, CharacterGender } from './players.types';
export type EventKey = 'ENGINE' | 'WORLD' | 'NETWORK' | 'CHUNK' | `CHUNK.${number}` | `${EntityType}` | `${EntityType}.${string | number}`;
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
    onConnect: (entity: T) => void;
    onDisconnect: (entity: T) => void;
    onEnter: (entity: T) => void;
    onLeave: (entity: T) => void;
    onStreamIn: (entity: T) => void;
    onStreamOut: (entity: T) => void;
};
export type PlayerEventMap = {
    onGenderChange: (gender: CharacterGender) => void;
    onControlChange: (control: keyof PlayerControls, newState: boolean, oldState: boolean) => void;
    onStateChange: (newState: PlayerState | null, oldState: PlayerState | null) => void;
    onStateAnimationChange: (anim: number) => void;
    onHeadMove: (euler: [number, number, number]) => void;
};
export type ObjectEventMap = {
    onChildAdded: (children: ObjectManager) => void;
    onChildRemoved: (children: ObjectManager) => void;
};
export type ChatEventMap = {
    onChat: (text: string) => void;
};
