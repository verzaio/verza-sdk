import {
  EncryptedPacketsDto,
  PlayerPacketDto,
  PlayerPacketUpdateDto,
  ServerDto,
} from 'engine/generated/dtos.types';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {CameraModeType, CameraPosition, CameraTransition} from './camera.types';
import {CommandInfo} from './commands.types';
import {CreateObjectProps, ObjectType} from './objects.types';
import {KeyInfo} from './ui.types';
import {QuaternionArray, Vector3Array} from './world.types';

export type ScriptStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'failed';

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

export type CustomEventData = {
  [name: string]: any;
};

export type ScriptEventMap = {
  /* messenger */
  register: (eventName: string) => void;

  unregister: (eventName: string) => void;

  /* engine */
  setPlayerId: (playerId: number) => void;

  onFrame: (delta: number) => void;

  onSynced: () => void;

  /* chat */
  onChat: (text: string, playerId?: number) => void;

  sendMessage: (text: string, playerId?: number) => void;

  onCommand: (command: string, player?: PlayerManager) => void;

  onCommandNotFound: (command: string) => void;

  registerCommand: (playerId: number, commandInfo: CommandInfo) => void;

  unregisterCommand: (playerId: number, command: string) => void;

  /* ui */
  onEscapeKey: () => void;

  onKey: (keyInfo: KeyInfo) => void;

  addInterface: (tag: string) => void;

  removeInterface: (tag: string) => void;

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
  onCameraModeChange: (
    playerId: number,
    mode: CameraModeType,
    instant?: boolean,
  ) => void;

  setCameraTransitions: (
    playerId: number,
    transitions: CameraTransition[],
  ) => void;

  setCameraTransition: (playerId: number, transition: CameraTransition) => void;

  setCameraPosition: (playerId: number, position: CameraPosition) => void;

  onCameraTransitionStart: (id?: number | string) => void;

  onCameraTransitionEnd: (id?: number | string) => void;

  /* objects */
  createObject: (type: ObjectType, props: CreateObjectProps) => void;

  setObjectPosition: (objectId: string, position: Vector3Array) => void;

  setObjectRotation: (
    objectId: string,
    rotation: QuaternionArray | Vector3Array,
  ) => void;

  destroyObject: (objectId: string) => void;

  /* api */
  syncServer: (server: ServerDto, endpoint: string) => void;

  syncEncryptedPackets: (packets: EncryptedPacketsDto) => void;

  /* custom events */
  emitToServer: (event: string, data?: CustomEventData) => void;

  emitToPlayers: (event: string, data?: CustomEventData) => void;

  emitToPlayer: (
    playerId: number,
    event: string,
    data?: CustomEventData,
  ) => void;
} & {
  [key in `onServerCustomEvent_${string}`]: (data?: CustomEventData) => void;
} & {
  [key in `onPlayerCustomEvent_${string}`]: (
    playerId: number,
    data?: CustomEventData,
  ) => void;
};
