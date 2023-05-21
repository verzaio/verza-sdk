import {
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Texture,
} from 'three';

export const MATERIAL_MAPS = new Set<
  | keyof MeshStandardMaterial
  | keyof MeshPhysicalMaterial
  | keyof MeshBasicMaterial
>([
  'map',
  'envMap',
  'alphaMap',
  'emissiveMap',
  'bumpMap',
  'normalMap',
  'displacementMap',
  'roughnessMap',
  'metalnessMap',
  'clearcoatMap',
  'clearcoatRoughnessMap',
  'clearcoatNormalMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'transmissionMap',
  'thicknessMap',
  'specularIntensityMap',
  'specularColorMap',
  'iridescenceMap',
  'iridescenceThicknessMap',
  'specularMap',
  'lightMap',
  'aoMap',
]);

export const MATERIAL_MAPS_SRGB_COLOR_SPACE = new Set<
  keyof MeshStandardMaterial | keyof MeshPhysicalMaterial
>(['map', 'sheenColorMap', 'emissiveMap', 'specularColorMap']);

export const MATERIAL_MAPS_SHARED_PROPS = new Set<
  | keyof MeshStandardMaterial
  | keyof MeshPhysicalMaterial
  | keyof MeshBasicMaterial
>([
  'envMap',
  'alphaMap',
  'emissiveMap',
  'bumpMap',
  'normalMap',
  'displacementMap',
  'roughnessMap',
  'metalnessMap',
  'clearcoatMap',
  'clearcoatRoughnessMap',
  'clearcoatNormalMap',
  'sheenColorMap',
  'sheenRoughnessMap',
  'transmissionMap',
  'thicknessMap',
  'specularIntensityMap',
  'specularColorMap',
  'iridescenceMap',
  'iridescenceThicknessMap',
  'specularMap',
  'lightMap',
  'aoMap',
]);

export const MATERIAL_TEXTURE_SHARED_PROPS = new Set<keyof Texture>([
  'offset',
  'repeat',
  'center',
  'rotation',
  'wrapS',
  'wrapT',
  'flipY',
  'anisotropy',
]);
