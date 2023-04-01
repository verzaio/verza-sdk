import {
  BlendingDstFactor,
  BlendingSrcFactor,
  DepthModes,
  Side,
  Blending,
  BlendingEquation,
  NormalMapTypes,
  TextureEncoding,
  Mapping,
  Wrapping,
  TextureFilter,
  PixelFormat,
} from 'three';

import {ColorType} from '../ui.types';
import {Vector2Array} from '../world.types';

export type ObjectMaterial = {
  /**
   * Blending destination. It's one of the blending mode constants defined in Three.js. Default OneMinusSrcAlphaFactor.
   * @default OneMinusSrcAlphaFactor {https://threejs.org/docs/#api/en/constants/Textures}
   */
  blendDst?: BlendingDstFactor;

  /**
   * The tranparency of the .blendDst. Default is null.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default null
   */
  blendDstAlpha?: number | null;

  /**
   * Blending equation to use when applying blending. Default is AddEquation.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default AddEquation
   */
  blendEquation?: BlendingEquation;

  /**
   * The tranparency of the .blendEquation. Default is null.
   * @default null
   */
  blendEquationAlpha?: number | null;

  /**
   * Which blending to use when displaying objects with this material. Default is NormalBlending.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default NormalBlending
   */
  blending?: Blending;

  /**
   * Blending source. It's one of the blending mode constants defined in Three.js. Default is SrcAlphaFactor.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default SrcAlphaFactor
   */
  blendSrc?: BlendingSrcFactor | BlendingDstFactor;

  /**
   * The tranparency of the .blendSrc. Default is null.
   * @default null
   */
  blendSrcAlpha?: number | null;

  /**
   * Whether to render the material's color. This can be used in conjunction with a mesh's .renderOrder property to create invisible objects that occlude other objects. Default is true.
   * @default true
   */
  colorWrite?: boolean;

  /**
   * Which depth function to use. Default is LessEqualDepth. See the depth mode constants for all possible values.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default LessEqualDepth
   */
  depthFunc?: DepthModes;

  /**
   * Whether to have depth test enabled when rendering this material. Default is true.
   * @default true
   */
  depthTest?: boolean;

  /**
   * Whether rendering this material has any effect on the depth buffer. Default is true.
   * When drawing 2D overlays it can be useful to disable the depth writing in order to layer several things together without creating z-index artifacts.
   * @default true
   */
  depthWrite?: boolean;

  /**
   * Opacity. Default is 1.
   * @default 1
   */
  opacity?: number;

  /**
   * Defines which of the face sides will be rendered - front, back or both.
   * Default is FrontSide. Other options are BackSide and DoubleSide.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default FrontSide
   */
  side?: Side;

  /**
   * Defines which of the face sides will cast shadows. Default is *null*.
   * If *null*, the value is opposite that of side, above.
   * @see {@link https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquation}
   * @default null
   */
  shadowSide?: Side | null;

  /**
   * Defines whether this material is transparent. This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects.
   * When set to true, the extent to which the material is transparent is controlled by setting it's .opacity property.
   * Default is false.
   * @default false
   */
  transparent?: boolean;

  /**
   * Defines whether vertex coloring is used. Default is false.
   * @default false
   */
  vertexColors?: boolean;
};

export type ObjectTextureType = ObjectTexture | string | null;

export type ObjectStandardMaterial = ObjectMaterial & {
  /**
   * @default white
   */
  color?: ColorType;

  /**
   * @default 1
   */
  roughness?: number;

  /**
   * @default 0
   */
  metalness?: number;

  /**
   * @default null
   */
  map?: ObjectTextureType;

  /**
   * @default null
   */
  lightMap?: ObjectTextureType;

  /**
   * @default 1
   */
  lightMapIntensity?: number;

  /**
   * @default null
   */
  aoMap?: ObjectTextureType;

  /**
   * @default 1
   */
  aoMapIntensity?: number;

  /**
   * @default black
   */
  emissive?: ColorType;

  /**
   * @default 1
   */
  emissiveIntensity?: number;

  /**
   * @default null
   */
  emissiveMap?: ObjectTextureType;

  /**
   * @default null
   */
  bumpMap?: ObjectTextureType;

  /**
   * @default 1
   */
  bumpScale?: number;

  /**
   * @default null
   */
  normalMap?: ObjectTextureType;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default TangentSpaceNormalMap
   */
  normalMapType?: NormalMapTypes;

  /**
   * @default new Array( 1, 1 )
   */
  normalScale?: Vector2Array;

  /**
   * @default null
   */
  displacementMap?: ObjectTextureType;

  /**
   * @default 1
   */
  displacementScale?: number;

  /**
   * @default 0
   */
  displacementBias?: number;

  /**
   * @default null
   */
  roughnessMap?: ObjectTextureType;

  /**
   * @default null
   */
  metalnessMap?: ObjectTextureType;

  /**
   * @default null
   */
  alphaMap?: ObjectTextureType;

  /**

   * @default null
   */
  envMap?: ObjectTextureType;

  /**
   * @default 1
   */
  envMapIntensity?: number;

  /**
   * @default false
   */
  wireframe?: boolean;

  /**
   * @default 1
   */
  wireframeLinewidth?: number;

  /**
   * @default 'round'
   */
  wireframeLinecap?: 'butt' | 'round' | 'square';

  /**
   * @default 'round'
   */
  wireframeLinejoin?: 'round' | 'bevel' | 'miter';

  /**
   * Define whether the material is rendered with flat shading. Default is false.
   * @default false
   */
  flatShading?: boolean;
};

export type ObjectTexture = {
  /**
   * Asset URL or Asset ID
   */
  source: string;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default DEFAULT_MAPPING
   */
  mapping?: Mapping;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default ClampToEdgeWrapping
   */
  wrapS?: Wrapping;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default ClampToEdgeWrapping
   */
  wrapT?: Wrapping;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default LinearFilter
   */
  magFilter?: TextureFilter;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default LinearMipmapLinearFilter
   */
  minFilter?: TextureFilter;

  /**
   * @default 1
   */
  anisotropy?: number;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default RGBAFormat
   */
  format?: PixelFormat;

  /**
   * @default new Array(0, 0)
   */
  offset?: Vector2Array;

  /**
   * @default new Array(1, 1)
   */
  repeat?: Vector2Array;

  /**
   * @default new Array( 0, 0 )
   */
  center?: Vector2Array;

  /**
   * @default 0
   */
  rotation?: number;

  /**
   * @default true
   */
  flipY?: boolean;

  /**
   * @see {@link https://threejs.org/docs/#api/en/constants/Textures}
   * @default LinearEncoding
   */
  encoding?: TextureEncoding;
};
