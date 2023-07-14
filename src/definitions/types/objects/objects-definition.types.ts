import {
  EntityColliderType,
  EntityCollisionType,
  EntityDrawDistanceType,
} from '../entities.types';
import {ColorType} from '../ui.types';
import {Boolean3Array, QuaternionArray, Vector3Array} from '../world.types';
import {ObjectMaterialMix} from './objects-materials.types';
import {ObjectType} from './objects.types';

export type PickObject<T extends ObjectType> = ObjectTypes[T];

export type PickObjectProps<T extends ObjectType> = PickObject<T>['o'];

export type ObjectDataBase = {
  userData?: {
    [name: string]: unknown;
  };
};

export type ObjectBaseType<T extends ObjectType = ObjectType, D = unknown> = {
  id?: string; // id

  parent_id?: string; // parent

  t: T; // type

  o: ObjectDataBase & D; // object data

  dd?: EntityDrawDistanceType | null;

  p?: Vector3Array; // position

  r?: QuaternionArray | Vector3Array; // rotation

  s?: Vector3Array; // scale

  d?: number; // dimension

  ss?: boolean; // shadows

  c?: EntityCollisionType | null; // collision

  cc?: EntityColliderType | null; // collider

  cs?: boolean; // collision sensor

  m?: number; // mass

  ff?: number; // friction

  rr?: number; // restitution

  er?: Boolean3Array; // enabled rotations

  et?: Boolean3Array; // enabled translations

  po?: boolean; // permanent object

  ro?: number; // render order

  rm?: boolean; // remote object
};

export type ObjectMaterialProps = {
  bloom?: boolean;

  color?: ColorType;

  material?: ObjectMaterialMix;
};

export type ObjectGroupType = ObjectBaseType<
  'group',
  {
    c?: ObjectTypeValues[];
  }
>;

export type ObjectModelType = ObjectBaseType<
  'model',
  {
    model?: unknown; // data
  }
>;

export type ObjectGltfType = ObjectBaseType<
  'gltf',
  {
    u?: string;

    bloom?: boolean;
  }
>;

export type ObjectBoxType = ObjectBaseType<
  'box',
  {
    width?: number; // width

    height?: number; // height

    depth?: number; // depth

    widthSegments?: number; // widthSegments

    heightSegments?: number; // widthSegments

    depthSegments?: number; // depthsegments

    radius?: number; // border radius
  } & ObjectMaterialProps
>;

export type ObjectSphereType = ObjectBaseType<
  'sphere',
  {
    radius?: number;

    heightSegments?: number;

    widthSegments?: number;
  } & ObjectMaterialProps
>;

export type ObjectCapsuleType = ObjectBaseType<
  'capsule',
  {
    radius?: number;

    length?: number;

    capSegments?: number;

    radialSegments?: number;
  } & ObjectMaterialProps
>;

export type ObjectCylinderType = ObjectBaseType<
  'cylinder',
  {
    radiusTop?: number;

    radiusBottom?: number;

    height?: number;

    heightSegments?: number;

    radialSegments?: number;

    openEnded?: boolean;

    thetaStart?: number;

    thetaLength?: number;
  } & ObjectMaterialProps
>;

export type ObjectCircleType = ObjectBaseType<
  'circle',
  {
    radius?: number;

    segments?: number;

    thetaStart?: number;

    thetaLength?: number;
  } & ObjectMaterialProps
>;

export type ObjectConeType = ObjectBaseType<
  'cone',
  {
    radius?: number;

    height?: number;

    radialSegments?: number;

    heightSegments?: number;

    openEnded?: boolean;

    thetaStart?: number;

    thetaLength?: number;
  } & ObjectMaterialProps
>;

export type ObjectTorusType = ObjectBaseType<
  'torus',
  {
    radius?: number;

    tube?: number;

    radialSegments?: number;

    tubularSegments?: number;

    arc?: number;
  } & ObjectMaterialProps
>;

export type ObjectPlaneType = ObjectBaseType<
  'plane',
  {
    width?: number;

    height?: number;

    widthSegments?: number;

    heightSegments?: number;

    surface?: boolean;
  } & ObjectMaterialProps
>;

export type ObjectTetrahedronType = ObjectBaseType<
  'tetrahedron',
  {
    radius?: number;

    detail?: number;
  } & ObjectMaterialProps
>;

export type ObjectDodecahedronType = ObjectBaseType<
  'dodecahedron',
  {
    radius?: number;

    detail?: number;
  } & ObjectMaterialProps
>;

export type ObjectOctahedronType = ObjectBaseType<
  'octahedron',
  {
    radius?: number;

    detail?: number;
  } & ObjectMaterialProps
>;

export type ObjectIcosahedronType = ObjectBaseType<
  'icosahedron',
  {
    radius?: number;

    detail?: number;
  } & ObjectMaterialProps
>;

export type ObjectLineType = ObjectBaseType<
  'line',
  {
    points?: Vector3Array[];

    bloom?: boolean;

    color?: ColorType;
  }
>;

export type ObjectTextType = ObjectBaseType<
  'text',
  {
    text?: string;

    color?: ColorType;

    fontSize?: number;

    maxWidth?: number;

    lineHeight?: number;

    letterSpacing?: number;

    textAlign?: 'center' | 'left' | 'right' | 'justify';

    font?: string | null;

    anchorX?: number | 'center' | 'left' | 'right';

    anchorY?:
      | number
      | 'bottom'
      | 'top'
      | 'middle'
      | 'top-baseline'
      | 'bottom-baseline';

    direction?: 'auto' | 'ltr' | 'rtl';

    overflowWrap?: 'normal' | 'break-word';

    whiteSpace?: 'normal' | 'nowrap' | 'overflowWrap';

    outlineWidth?: string | number;

    outlineOffsetX?: string | number;

    outlineOffsetY?: string | number;

    outlineBlur?: string | number;

    outlineColor?: ColorType;

    outlineOpacity?: number;

    strokeWidth?: string | number;

    strokeColor?: ColorType;

    strokeOpacity?: number;

    fillOpacity?: number;
  }
>;

export type ObjectSpotLightType = ObjectBaseType<
  'spotlight',
  {
    color?: ColorType;
    intensity?: number;
    distance?: number;
    angle?: number;
    penumbra?: number;
    decay?: number;
    target?: Vector3Array;
  }
>;

export type ObjectPointLightType = ObjectBaseType<
  'pointlight',
  {
    color?: ColorType;
    intensity?: number;
    distance?: number;
    decay?: number;
  }
>;

export type ObjectRectAreaLightType = ObjectBaseType<
  'rectarealight',
  {
    color?: ColorType;
    intensity?: number;
    width?: number;
    height?: number;
  }
>;

export type ObjectTypes = {
  group: ObjectGroupType;

  model: ObjectModelType;

  box: ObjectBoxType;

  sphere: ObjectSphereType;

  capsule: ObjectCapsuleType;

  cylinder: ObjectCylinderType;

  circle: ObjectCircleType;

  cone: ObjectConeType;

  torus: ObjectTorusType;

  plane: ObjectPlaneType;

  tetrahedron: ObjectTetrahedronType;

  dodecahedron: ObjectDodecahedronType;

  octahedron: ObjectOctahedronType;

  icosahedron: ObjectIcosahedronType;

  line: ObjectLineType;

  gltf: ObjectGltfType;

  text: ObjectTextType;

  spotlight: ObjectSpotLightType;

  pointlight: ObjectPointLightType;

  rectarealight: ObjectRectAreaLightType;
};

export type ObjectTypeValues<T extends ObjectTypes = ObjectTypes> = T[keyof T];
