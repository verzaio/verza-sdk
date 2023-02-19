import {
  EncryptedPacketsDto,
  PlayerPacketDto,
  PlayerPacketUpdateDto,
  ServerDto,
} from 'engine/generated/dtos.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {CameraModeType, CameraPosition, CameraTransition} from './camera.types';
import {CommandInfo} from './commands.types';
import {PlayerControls} from './controls.types';
import {CreateObjectProps, ObjectDataProps, ObjectType} from './objects.types';
import {
  IndicatorId,
  IndicatorTitle,
  KeyEvent,
  PointerEvent,
  SizeProps,
  ToolbarElement,
} from './ui.types';
import {
  IntersectsResult,
  IntersectsResultRaw,
  QuaternionArray,
  Vector3Array,
} from './world.types';

export type ScriptStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'failed';

/* scripts */

export type CustomEventData = {
  [name: string]: any;
};

export type ObjectEditMode = 'position' | 'rotation';
export type ObjectEditUpdateType = 'start' | 'update' | 'end';

//export type Pointer
export type ScriptEventMap = {
  /* messenger */
  register: (eventName: string) => void;

  unregister: (eventName: string) => void;

  onConnect: () => void;

  onDisconnect: () => void;

  OR: (response: unknown) => void;

  /* engine */
  onSynced: () => void;

  setPlayerId: (playerId: number) => void;

  onFrame: (delta: number) => void;

  /* chat */
  onChat: (text: string, playerId?: number) => void;

  sendMessage: (text: string, playerId?: number) => void;

  onCommand: (command: string, player?: PlayerManager) => void;

  onCommandNotFound: (command: string) => void;

  registerCommand: (
    playerId: number,
    commandInfo: CommandInfo,
    tag: string,
  ) => void;

  unregisterCommand: (playerId: number, command: string) => void;

  /* ui */
  onEscapeKey: () => void;

  onPointerEvent: (event: PointerEvent) => void;

  onPointerMove: (event: PointerEvent) => void;

  onPointerDown: (event: PointerEvent) => void;

  onPointerUp: (event: PointerEvent) => void;

  onKeyEvent: (event: KeyEvent) => void;

  onKeyDown: (event: KeyEvent) => void;

  onKeyUp: (event: KeyEvent) => void;

  addInterface: (tag: string) => void;

  removeInterface: (tag: string) => void;

  showIndicator: (id: IndicatorId, title?: IndicatorTitle) => void;

  hideIndicator: (id: IndicatorId) => void;

  addToolbar: (toolbar: ToolbarElement) => void;

  removeToolbar: (toolbarId: string) => void;

  onToolbarItemPress: (id: string, toolbarId: string) => void;

  onCursorLock: (status: boolean) => void;

  setSize: (props: SizeProps<string>) => void;

  show: () => void;

  hide: () => void;

  /* players */
  OPU: (
    entityId: number,
    update: PlayerPacketDto | PlayerPacketUpdateDto,
  ) => void;

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

  setPlayerDimension: (playerId: number, dimension: number) => void;

  addPlayerRole: (playerId: number, role: string) => void;

  removePlayerRole: (playerId: number, role: string) => void;

  onControlChange: (
    control: keyof PlayerControls,
    newState: boolean,
    oldState: boolean,
  ) => void;

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

  setPlayerMovements: (playerId: number, status: boolean) => void;

  setPlayerTranslations: (
    playerId: number,
    x: boolean,
    y: boolean,
    z: boolean,
  ) => void;

  setPlayerLinearVelocity: (playerId: number, vel: Vector3Array) => void;

  setPlayerVisible: (playerId: number, visible: boolean) => void;

  sendPlayerNotification: (
    playerId: number,
    message: string,
    type: 'success' | 'error',
    duration: number,
  ) => void;

  /* camera */
  OCU: (position: Vector3Array, quaternion: QuaternionArray) => void;

  onCameraModeChange: (
    playerId: number,
    mode: CameraModeType,
    instant?: boolean,
  ) => void;

  setCameraTransitions: (
    playerId: number,
    transitions: CameraTransition<string>[],
  ) => void;

  setCameraTransition: (
    playerId: number,
    transition: CameraTransition<string>,
  ) => void;

  setCameraPosition: (playerId: number, position: CameraPosition) => void;

  onCameraTransitionStart: (id?: number | string) => void;

  onCameraTransitionEnd: (id?: number | string) => void;

  /* objects */
  createObject: (type: ObjectType, props: CreateObjectProps) => void;

  editObject: (objectId: string, mode: ObjectEditMode) => void;
  setObjectEditMode: (mode: ObjectEditMode) => void;
  setObjectEditSnaps: (
    position: number | null,
    rotation: number | null,
  ) => void;
  cancelObjectEdit: () => void;

  onObjectEditRaw: (
    object: ObjectDataProps,
    type: ObjectEditUpdateType,
  ) => void;
  onObjectEdit: (object: ObjectManager, type: ObjectEditUpdateType) => void;

  setObjectPosition: (objectId: string, position: Vector3Array) => void;

  setObjectRotation: (
    objectId: string,
    rotation: QuaternionArray | Vector3Array,
  ) => void;

  setPositionFromWorldSpace: (objectId: string, position: Vector3Array) => void;

  setRotationFromWorldSpace: (
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

  emitToPlayersWithRoles: (
    event: string,
    roles: string[],
    data?: CustomEventData,
  ) => void;

  emitToPlayersWithAccess: (
    event: string,
    command: string,
    data?: CustomEventData,
  ) => void;

  /* world */
  setEntitySelector: (status: boolean) => void;

  onEntitySelectedRaw: (intersects: IntersectsResultRaw) => void;
  onEntitySelected: (intersects: IntersectsResult) => void;

  raycastFromCursor: (x: number, y: number) => void;

  raycastFromPoints: (from: Vector3Array, to: Vector3Array) => void;

  /* server */
  restartServer: (reason?: string) => void;

  setForwardMessages: (status: boolean) => void;
} & {
  [key in `onServerCustomEvent_${string}`]: (data?: CustomEventData) => void;
} & {
  [key in `onPlayerCustomEvent_${string}`]: (
    playerId: number,
    data?: CustomEventData,
  ) => void;
};
