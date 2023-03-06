import EntitiesManager from 'engine/managers/entities/entities.manager';
import EntityHandleManager from 'engine/managers/entities/entity/entity-handle.manager';
import EntityStreamManager from 'engine/managers/entities/entity/entity-stream.manager';
import EntityManager from 'engine/managers/entities/entity/entity.manager';
import ObjectHandleManager from 'engine/managers/entities/objects/object/object-handle.manager';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import PlayerAnimationsManager from 'engine/managers/entities/players/player/player-animations.manager';
import PlayerCameraManager from 'engine/managers/entities/players/player/player-camera.manager';
import PlayerHandleManager from 'engine/managers/entities/players/player/player-handle.manager';
import PlayerVoicechatManager from 'engine/managers/entities/players/player/player-voicechat.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';
import PlayersManager from 'engine/managers/entities/players/players.manager';

import MessengerEmitterManager from './managers/messenger-emitter.manager';

export {
  ScriptEventMap,
  CustomEventData,
} from 'engine/definitions/types/scripts.types';

export {
  ObjectEditMode,
  ObjectEditActionType,
} from 'engine/definitions/types/objects/objects.types';

export {
  Vector3Array,
  QuaternionArray,
  WorldPosition,
  WorldPositionRotation,
  IntersectsResult,
  RaycastOptions,
} from 'engine/definitions/types/world.types';

export {
  KeyEventType,
  KeyEvent,
  IndicatorId,
  IndicatorTitle,
  Indicator,
  SizePropValue,
  SizeProps,
  ToolbarElement,
  ToolbarItem,
  ToolbarPosition,
  PointerEvent,
  PointerEventType,
  FileTransfer,
} from 'engine/definitions/types/ui.types';

export {
  ObjectMaterial,
  ObjectTextureType,
  ObjectTexture,
  ObjectStandardMaterial,
} from 'engine/definitions/types/objects/objects-materials.types';

export {PlayerControls} from 'engine/definitions/types/controls.types';

export type {
  EntitiesManager,
  EntityHandleManager,
  EntityStreamManager,
  EntityManager,
};

export type {ObjectsManager, ObjectManager, ObjectHandleManager};

export type {
  MessengerEmitterManager,
  PlayersManager,
  PlayerManager,
  PlayerHandleManager,
  PlayerVoicechatManager,
  PlayerCameraManager,
  PlayerAnimationsManager,
};

// custom blending destination factors
export {
  BlendingDstFactor,
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
export {BlendingSrcFactor, SrcAlphaSaturateFactor} from 'three';

// depth modes
export {
  DepthModes,
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
export {Side, FrontSide, BackSide, DoubleSide} from 'three';

// blending modes
export {
  Blending,
  NoBlending,
  NormalBlending,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  CustomBlending,
} from 'three';

export {
  BlendingEquation,
  AddEquation,
  SubtractEquation,
  ReverseSubtractEquation,
  MinEquation,
  MaxEquation,
} from 'three';

// Normal Map types
export {
  NormalMapTypes,
  TangentSpaceNormalMap,
  ObjectSpaceNormalMap,
} from 'three';

// Texture Encodings
export {TextureEncoding, LinearEncoding, sRGBEncoding} from 'three';

// Mapping modes
export {
  Mapping,
  UVMapping,
  CubeReflectionMapping,
  CubeRefractionMapping,
  EquirectangularReflectionMapping,
  EquirectangularRefractionMapping,
  CubeUVReflectionMapping,
} from 'three';

// Wrapping modes
export {
  Wrapping,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
} from 'three';

// Filters
export {
  TextureFilter,
  NearestFilter,
  NearestMipmapNearestFilter,
  NearestMipMapNearestFilter,
  NearestMipmapLinearFilter,
  NearestMipMapLinearFilter,
  LinearFilter,
  LinearMipmapNearestFilter,
  LinearMipMapNearestFilter,
  LinearMipmapLinearFilter,
  LinearMipMapLinearFilter,
} from 'three';

// Pixel formats
export {
  PixelFormat,
  AlphaFormat,
  RGBFormat,
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
