import {
  SoundEvent,
  SoundItem,
  SoundOptions,
} from 'engine/definitions/types/audio.types';
import {StorageModeType} from 'engine/definitions/types/storage.types';
import {StorageFilters} from 'engine/definitions/types/storage.types';
import {StorageResult} from 'engine/definitions/types/storage.types';
import {
  ChunkDto,
  EncryptedPacketsDto,
  PlayerPacketDto,
  PlayerPacketUpdateDto,
  ServerDto,
} from 'engine/generated/dtos.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

import {
  AnimationEvent,
  AnimationInfo,
  AnimationOptions,
} from './animations.types';
import {AssetOptions} from './assets.types';
import {CameraModeType, CameraPosition, CameraTransition} from './camera.types';
import {ChunkData, ChunkIndex} from './chunks.types';
import {ClotheItem, PlayerClotheItem, SkinMaskItem} from './clothes.types';
import {CommandInfo} from './commands.types';
import {PlayerControls} from './controls.types';
import {ParticleOptions} from './effects.types';
import {FileTransfer, KeyEvent, PointerEvent, DragEvent} from './input.types';
import {ObjectTypes} from './objects/objects-definition.types';
import {
  ObjectBoundingBox,
  ObjectDataProps,
  ObjectEditActionType,
  ObjectEditAxes,
  ObjectEditTransform,
  ObjectHighlightOptions,
  ObjectTransition,
} from './objects/objects.types';
import {PlayerBanStatus} from './players.types';
import {
  ColorType,
  IndicatorId,
  IndicatorTitle,
  UISizeProps,
  ToolbarElement,
  MainToolbarItem,
  UIComponentType,
} from './ui.types';
import {
  IntersectsResultRaw,
  MoonPhases,
  ProximityAction,
  ProximityActionEvent,
  QuaternionArray,
  RaycastOptions,
  SkyboxProps,
  TimeMode,
  Timezone,
  Vector3Array,
  ViewportRender,
  WeatherType,
} from './world.types';

export type ScriptStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'failed';

/* scripts */

export type NetworkEventData = {
  [name: string]: any;
};

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

  /* chat */
  onChat: (text: string, playerId?: number) => void;

  sendMessage: (text: string, playerId?: number) => void;

  onCommand: (command: string) => void;

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

  onPointerLeave: (event: PointerEvent) => void;

  onPointerEnter: (event: PointerEvent) => void;

  onKeyEvent: (event: KeyEvent) => void;

  onKeyDown: (event: KeyEvent) => void;

  onKeyUp: (event: KeyEvent) => void;

  onDragEvent: (event: DragEvent) => void;

  onDragLeave: (event: DragEvent) => void;

  onDragEnter: (event: DragEvent) => void;

  onDragOver: (event: DragEvent) => void;

  onDrop: (event: DragEvent, files: FileTransfer[]) => void;

  openUrl: (tag: string) => void;

  goToServer: (serverId: string) => void;

  isUIComponent: (type: UIComponentType) => boolean;

  toggleUIComponent: (type: UIComponentType) => void;

  showUIComponent: (type: UIComponentType) => void;

  hideUIComponent: (type: UIComponentType) => void;

  addInterface: (tag: string) => void;

  removeInterface: (tag: string) => void;

  showIndicator: (id: IndicatorId, title?: IndicatorTitle) => void;

  hideIndicator: (id: IndicatorId) => void;

  addMainToolbarItem: (item: MainToolbarItem) => void;

  removeMainToolbarItem: (id: string) => void;

  addToolbar: (toolbar: ToolbarElement) => void;

  removeToolbar: (toolbarId: string) => void;

  onToolbarItemPress: (id: string, toolbarId: string) => void;

  onCursorLock: (status: boolean) => void;

  onInputFocus: (status: boolean) => void;

  setSize: (props: UISizeProps<string>) => void;

  show: () => void;

  hide: () => void;

  /* clothing */
  addSkinMask: (mask: SkinMaskItem) => void;

  removeSkinMask: (id: string) => void;

  addClothe: (item: ClotheItem) => void;

  removeClothe: (clotheId: string) => void;

  addPlayerClothes: (
    playerId: number,
    clotheItems: PlayerClotheItem[],
    replace: boolean,
  ) => void;

  getPlayerClothes: (playerId: number) => PlayerClotheItem[];

  removePlayerClothes: (playerId: number, clotheIds: string[]) => void;

  /* animations */
  addAnimations: (url: string) => AnimationInfo[];

  getAnimation: (id: string) => AnimationInfo;

  removeAnimation: (id: string) => void;

  getAnimations: () => AnimationInfo[];

  playPlayerAnimation: (
    playerId: number,
    animId: string,
    options: AnimationOptions,
  ) => void;

  pausePlayerAnimation: (playerId: number, animId: string) => void;

  resumePlayerAnimation: (playerId: number, animId: string) => void;

  stopPlayerAnimation: (
    playerId: number,
    animId: string,
    fadeOutDuration: number,
  ) => void;

  stopPlayerAnimations: (playerId: number, fadeOutDuration: number) => void;

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

  onPlayerStreamInRaw: (playerId: number, data?: PlayerManager['data']) => void;

  onPlayerStreamOutRaw: (playerId: number) => void;

  onPlayerEnterSensorRaw: (playerId: number, objectId: ObjectManager) => void;

  onPlayerLeaveSensorRaw: (playerId: number, objectId: ObjectManager) => void;

  setPlayerName: (playerId: number, name: string) => void;

  setPlayerNametagColor: (playerId: number, color: ColorType) => void;

  setPlayerDimension: (playerId: number, dimension: number) => void;

  getPlayerBanStatus: (playerId: number) => PlayerBanStatus;

  unbanPlayer: (playerId: number) => void;

  banPlayer: (
    playerId: number,
    reason: string | null,
    duration: number | null,
  ) => PlayerBanStatus;

  kickPlayer: (playerId: number, reason: string | null) => void;

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

  startCameraTransitions: (
    playerId: number,
    transitions: CameraTransition<string>[],
  ) => void;

  startCameraTransition: (
    playerId: number,
    transition: CameraTransition<string>,
  ) => void;

  stopCameraTransitions: (playerId: number) => void;

  setCameraFov: (playerId: number, fov: number | null) => void;

  setCameraPosition: (playerId: number, position: CameraPosition) => void;

  onCameraTransitionStart: (id?: number | string) => void;

  onCameraTransitionEnd: (id?: number | string) => void;

  /* entities */
  getEntitiesInChunk: (chunkIndex: ChunkIndex) => ChunkDto;

  /* chunks */
  sendChunk: (chunkIndex: ChunkIndex, chunk: ChunkData) => void;

  /* assets */
  uploadAsset: (file: FileTransfer, options: AssetOptions) => string;

  deleteAsset: (assetId: string) => void;

  /* objects */
  createObject: (objectId: string, props: Partial<ObjectTypes>) => void;

  isObjectStreamed: (objectId: string) => boolean;

  syncObject: (objectId: string, props: Partial<ObjectTypes>) => void;

  syncObjectLocal: (objectId: string) => void;

  saveObject: (objectId: string, props: Partial<ObjectTypes>) => void;

  saveObjectLocal: (objectId: string) => void;

  deleteObject: (objectId: string) => void;

  getObject: (objectId: string) => ObjectDataProps;

  destroyObject: (objectId: string) => void;

  destroyObjectClient: (objectId: string) => void;

  editObject: (objectId: string) => void;

  setObjectData: (
    objectId: string,
    data: Partial<ObjectTypes>,
    partial: boolean,
  ) => void;

  setObjectVisible: (objectId: string, visible: boolean) => void;

  rerenderObject: (objectId: string) => void;

  onObjectStreamIn: (object: ObjectManager) => void;

  onObjectStreamOut: (object: ObjectManager) => void;

  onObjectStreamInRaw: (objectId: string) => void;

  onObjectStreamOutRaw: (objectId: string) => void;

  setObjectEditAxes: (axes: ObjectEditAxes) => void;

  setObjectEditSnaps: (
    position: number | null,
    rotation: number | null,
    scale: number | null,
  ) => void;

  cancelObjectEdit: () => void;

  onObjectEditRaw: (
    object: ObjectDataProps,
    type: ObjectEditActionType,
    prevTransform: ObjectEditTransform,
  ) => void;

  onObjectEdit: (
    object: ObjectManager,
    type: ObjectEditActionType,
    prevTransform: ObjectEditTransform,
  ) => void;

  setObjectPosition: (objectId: string, position: Vector3Array) => void;

  setObjectRotation: (
    objectId: string,
    rotation: QuaternionArray | Vector3Array,
  ) => void;

  setObjectScale: (objectId: string, scale: Vector3Array) => void;

  setObjectPositionFromWorldSpace: (
    objectId: string,
    position: Vector3Array,
  ) => void;

  setObjectRotationFromWorldSpace: (
    objectId: string,
    rotation: QuaternionArray | Vector3Array,
  ) => void;

  setObjectHelper: (objectId: string, status: boolean) => void;

  enableObjectHighlight: (
    objectId: string,
    options: ObjectHighlightOptions,
  ) => void;

  disableObjectHighlight: (objectId: string) => void;

  getObjectBoundingBox: (objectId: string) => ObjectBoundingBox;

  getObjectWorldBoundingBox: (objectId: string) => ObjectBoundingBox;

  setObjectLinearVelocity: (objectId: string, vector: Vector3Array) => void;

  setObjectAngularVelocity: (objectId: string, vector: Vector3Array) => void;

  applyObjectImpulse: (objectId: string, vector: Vector3Array) => void;

  addObjectTorque: (objectId: string, vector: Vector3Array) => void;

  applyObjectTorqueImpulse: (objectId: string, vector: Vector3Array) => void;

  startObjectTransition: (
    objectId: string,
    transition: ObjectTransition<string>,
  ) => void;

  startObjectTransitions: (
    objectId: string,
    transitions: ObjectTransition<string>[],
  ) => void;

  stopObjectTransitions: (objectId: string) => void;

  setObjectProximityAction: (
    objectId: string,
    action: Omit<ProximityAction, 'id' | 'objectId'>,
  ) => void;

  removeObjectProximityAction: (objectId: string) => void;

  /* api */
  syncServer: (server: ServerDto, endpoint: string) => void;

  syncEncryptedPackets: (packets: EncryptedPacketsDto) => void;

  /* custom events */
  emitToScripts: (event: string, data?: NetworkEventData) => void;

  emitToServer: (event: string, data?: NetworkEventData) => void;

  emitToPlayers: (event: string, data?: NetworkEventData) => void;

  emitToPlayer: (
    playerId: number,
    event: string,
    data?: NetworkEventData,
  ) => void;

  emitToPlayersWithRoles: (
    event: string,
    roles: string[],
    data?: NetworkEventData,
  ) => void;

  emitToPlayersWithAccess: (
    event: string,
    command: string,
    data?: NetworkEventData,
  ) => void;

  /* audio */
  addSound(sound: SoundItem): boolean;

  removeSound(soundId: string): void;

  createSound(soundId: string, options: SoundOptions, withId: string): void;

  createObjectSound(
    soundId: string,
    objectId: string,
    options: SoundOptions,
    withId: string,
  ): void;

  playSound(soundId: string): void;

  pauseSound(soundId: string): void;

  resumeSound(soundId: string): void;

  stopSound(soundId: string): void;

  destroySound(soundId: string): void;

  setSoundOptions(soundId: string, options: SoundOptions): void;

  onSoundEnd: (event: SoundEvent) => void;

  /* particles */
  createParticles: (particlesId: string, options: ParticleOptions) => void;

  createPlayerParticles: (
    particlesId: string,
    playerId: number,
    options: ParticleOptions,
  ) => void;

  createObjectParticles: (
    particlesId: string,
    objectId: string,
    options: ParticleOptions,
  ) => void;

  setParticlesOptions: (
    particlesId: string,
    options: ParticleOptions,
    respawn: boolean,
  ) => void;

  playParticles: (
    particlesId: string,
    reset: boolean,
    options: ParticleOptions,
    respawn: boolean,
  ) => void;

  pauseParticles: (particlesId: string) => void;

  stopParticles: (particlesId: string, instant: boolean) => void;

  resumeParticles: (particlesId: string) => void;

  destroyParticles: (particlesId: string) => void;

  /* storage */
  setStoreValue: (
    mode: StorageModeType,
    name: string,
    scope: string,
    key: string,
    value: unknown,
    expiration: number,
  ) => void;

  getStoreValue: (
    mode: StorageModeType,
    name: string,
    scope: string,
    key: string,
  ) => unknown;

  deleteStoreValue: (
    mode: StorageModeType,
    name: string,
    scope: string,
    key: string,
  ) => void;

  getStoreDataList: (
    mode: StorageModeType,
    name: string,
    scope: string,
    filters: StorageFilters,
  ) => StorageResult;

  /* world */
  raycastScreenPoint: (
    x: number,
    y: number,
    maxDistance: number | null,
    options: RaycastOptions,
  ) => IntersectsResultRaw;

  raycastPoints: (
    from: Vector3Array,
    to: Vector3Array,
    options: RaycastOptions,
  ) => IntersectsResultRaw;

  raycastPoint: (
    origin: Vector3Array,
    direction: Vector3Array,
    maxDistance: number | null,
    options: RaycastOptions,
  ) => IntersectsResultRaw;

  createProximityAction: (action: ProximityAction) => void;

  deleteProximityAction: (actionId: string) => void;

  onProximityActionTriggered: (event: ProximityActionEvent) => void;

  /* server */
  restartServer: (reason?: string | null) => void;

  setForwardMessages: (status: boolean) => void;

  /* sky */
  setMoonPhase: (phase: MoonPhases) => void;

  setTime: (time: number) => void;

  getTime: () => number;

  setTimeMode: (timeMode: TimeMode) => void;

  setTimeCycleDuration: (timeCycleDuration: number) => void;

  setTimezone: (timezone: Timezone) => void;

  setWeather: (weather: WeatherType) => void;

  setFogStatus: (status: boolean) => void;

  setFogColor: (color: ColorType) => void;

  setFogDensity: (density: number) => void;

  setViewportRender: (type: ViewportRender) => void;

  setInteriorMode: (status: boolean) => void;

  setHemisphereLightColor: (color: ColorType) => void;
  setHemisphereLightGroundColor: (color: ColorType) => void;
  setHemisphereLightIntensity: (intensity: number) => void;

  setGlobalLightColor: (color: ColorType) => void;
  setGlobalLightIntensity: (intensity: number) => void;

  setSkybox: (skybox: SkyboxProps | string | null) => void;

  setSkyManualMode: (status: boolean) => void;

  onResourcesReady: () => void;

  requestResourcesCheck: (freeze: boolean) => void;

  areResourcesReady: () => boolean;
} & {
  [key in `onServerCustomEvent_${string}`]: (data?: NetworkEventData) => void;
} & {
  [key in `onPlayerCustomEvent_${string}`]: (
    player: number,
    data?: NetworkEventData,
  ) => void;
} & {
  [key in `onScriptCustomEvent_${string}`]: (data?: NetworkEventData) => void;
} & {
  [key in `onObjectStreamInRaw_${string}`]: () => void;
} & {
  [key in `onObjectStreamOutRaw_${string}`]: () => void;
} & {
  [key in `onObjectTransitionStartRaw_${string}`]: (
    id: number | string,
  ) => void;
} & {
  [key in `onObjectTransitionEndRaw_${string}`]: (id: number | string) => void;
} & {
  [key in `onObjectProximityActionTriggeredRaw_${string}`]: (
    event: ProximityActionEvent,
  ) => void;
} & {
  [key in `onObjectSoundEndRaw_${string}`]: (event: SoundEvent) => void;
} & {
  [key in `onPlayerAnimation_${string}`]: (event: AnimationEvent) => void;
} & {
  [key in `OPU_${number}`]: (
    update: PlayerPacketDto | PlayerPacketUpdateDto,
  ) => void;
} & {
  [key in `onPlayerEnterSensorRaw_${number}`]: (objectId: string) => void;
} & {
  [key in `onPlayerLeaveSensorRaw_${number}`]: (objectId: string) => void;
} & {
  [key in `onPlayerEnterObjectSensorRaw_${string}`]: (playerId: number) => void;
} & {
  [key in `onPlayerLeaveObjectSensorRaw_${string}`]: (playerId: number) => void;
};
