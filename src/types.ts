import EntitiesManager from 'engine/managers/entities/entities.manager';
import EntityStreamManager from 'engine/managers/entities/entity/entity-stream.manager';
import EntityManager from 'engine/managers/entities/entity/entity.manager';
import ObjectHandleManager from 'engine/managers/entities/objects/object/object-handle.manager';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import PlayerCameraManager from 'engine/managers/entities/players/player/player-camera.manager';
import PlayerVoicechatManager from 'engine/managers/entities/players/player/player-voicechat.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';
import PlayersManager from 'engine/managers/entities/players/players.manager';

import MessengerEmitterManager from './managers/messenger/messenger-emitter.manager';

export type {EngineParams} from 'engine/definitions/local/types/engine.types';

export type {MessengerManagerEventsMap} from 'engine/definitions/types/messenger.types';

export {
  PlayerState,
  CharacterGender,
  PlayerBanStatus,
} from './definitions/types/players.types';

export type {
  ScriptEventMap,
  NetworkEventData,
} from 'engine/definitions/types/scripts.types';

export type {
  AnimationLoop,
  AnimationInfo,
  AnimationOptions,
  AnimationEventType,
  AnimationEvent,
} from 'engine/definitions/types/animations.types';

export type {
  ClotheCategory,
  SkinMaskItem,
  ClotheItem,
  PlayerClotheItem,
} from 'engine/definitions/types/clothes.types';

export type {
  ObjectPointerEvent,
  ObjectProximityActionEvent,
} from 'engine/definitions/local/types/events.types';

export type {
  ObjectType,
  ObjectEditMode,
  ObjectEditActionType,
  ObjectEditTransform,
} from 'engine/definitions/types/objects/objects.types';

export type {
  PickObject,
  PickObjectProps,
} from 'engine/definitions/types/objects/objects-definition.types';

export type {
  Vector2Array,
  Vector3Array,
  EulerArray,
  QuaternionArray,
  IntersectsResult,
  RaycastOptions,
  ViewportRender,
  MoonPhases,
  SkyboxProps,
  Timezone,
  TimeMode,
  WeatherType,
} from 'engine/definitions/types/world.types';

export type {
  ColorType,
  IndicatorId,
  IndicatorTitle,
  Indicator,
  UISizePropValue,
  UISizeProps,
  MainToolbarItem,
  ToolbarElement,
  ToolbarItem,
  ToolbarPosition,
} from 'engine/definitions/types/ui.types';

export type {
  KeyEventType,
  KeyEvent,
  PointerEvent,
  PointerEventType,
  FileTransfer,
} from 'engine/definitions/types/input.types';

export type {
  ObjectMaterialType,
  ObjectTextureType,
  ObjectTexture,
  ObjectMaterialMix,
  ObjectMaterial,
  ObjectMaterialSharedProps,
  ObjectMaterialStandard,
  ObjectMaterialPhysical,
  ObjectMaterialBasic,
  ObjectMaterialNormal,
  ObjectMaterialDepth,
} from 'engine/definitions/types/objects/objects-materials.types';

export type {CreateObjectProps} from 'engine/definitions/local/types/objects.types';

export type {PlayerControls} from 'engine/definitions/types/controls.types';

export type {EntitiesManager, EntityStreamManager, EntityManager};

export type {ObjectsManager, ObjectManager, ObjectHandleManager};

export type {
  MessengerEmitterManager,
  PlayersManager,
  PlayerManager,
  PlayerVoicechatManager,
  PlayerCameraManager,
};

export type {
  EntityDrawDistanceType,
  EntityCollisionType,
  EntityColliderType,
} from './definitions/types/entities.types';

// custom blending destination factors
export {
  type BlendingDstFactor,
  ZeroFactor,
  OneFactor,
  SrcColorFactor,
  OneMinusSrcColorFactor,
  SrcAlphaFactor,
  OneMinusSrcAlphaFactor,
  DstAlphaFactor,
  OneMinusDstAlphaFactor,
  DstColorFactor,
  OneMinusDstColorFactor,
} from 'three';

// custom blending src factors
export {type BlendingSrcFactor, SrcAlphaSaturateFactor} from 'three';

// depth modes
export {
  type DepthModes,
  NeverDepth,
  AlwaysDepth,
  LessDepth,
  LessEqualDepth,
  EqualDepth,
  GreaterEqualDepth,
  GreaterDepth,
  NotEqualDepth,
} from 'three';

// side
export {type Side, FrontSide, BackSide, DoubleSide} from 'three';

// blending modes
export {
  type Blending,
  NoBlending,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  CustomBlending,
} from 'three';

export {
  type BlendingEquation,
  AddEquation,
  SubtractEquation,
  ReverseSubtractEquation,
  MinEquation,
  MaxEquation,
} from 'three';

// Normal Map types
export {
  type NormalMapTypes,
  TangentSpaceNormalMap,
  ObjectSpaceNormalMap,
} from 'three';

// Texture Encodings
export {type TextureEncoding, LinearEncoding, sRGBEncoding} from 'three';

// Mapping modes
export {
  type Mapping,
  UVMapping,
  CubeReflectionMapping,
  CubeRefractionMapping,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  CubeUVReflectionMapping,
} from 'three';

// Wrapping modes
export {
  type Wrapping,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
} from 'three';

// Filters
export {
  type TextureFilter,
  type MagnificationTextureFilter,
  type MinificationTextureFilter,
  NearestFilter,
  NearestMipmapNearestFilter,
  NearestMipmapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipmapLinearFilter,
} from 'three';

// Texture Data types
export {
  type TextureDataType,
  UnsignedByteType,
  ByteType,
  ShortType,
  UnsignedShortType,
  IntType,
  UnsignedIntType,
  FloatType,
  HalfFloatType,
  UnsignedShort4444Type,
  UnsignedShort5551Type,
  UnsignedInt248Type,
} from 'three';

// Pixel formats
export {
  type PixelFormat,
  AlphaFormat,
  RGBAFormat,
  LuminanceFormat,
  LuminanceAlphaFormat,
  DepthFormat,
  DepthStencilFormat,
  RedFormat,
  RedIntegerFormat,
  RGFormat,
  RGIntegerFormat,
  RGBAIntegerFormat,
} from 'three';

// Combine
export {
  type Combine,
  MultiplyOperation,
  MixOperation,
  AddOperation,
} from 'three';

// ColorSpace
export {
  type ColorSpace,
  NoColorSpace,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  DisplayP3ColorSpace,
} from 'three';
