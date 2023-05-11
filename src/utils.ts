import * as THREE from 'three';

import {GLTF} from 'three-stdlib';
import {v4} from 'uuid';

export {THREE};

export {z} from 'zod';

export {v4 as uuid};

export {MathUtils} from 'three';

export {
  GLTFLoader,
  GLTFExporter,
  FBXLoader,
  SkeletonUtils,
  SceneUtils,
  GeometryUtils,
} from 'three-stdlib';

export type {GLTF};

declare module 'three-stdlib' {
  export interface GLTFLoader {
    parseAsync(data: ArrayBuffer | string, path: string): Promise<GLTF>;
  }
}
