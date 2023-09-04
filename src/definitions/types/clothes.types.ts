import {Euler, Quaternion, Vector3} from 'three';

import {CharacterBone} from './bones.types';
import {ColorType} from './ui.types';
import {EulerArray, QuaternionArray, Vector3Array} from './world.types';

export type ClotheGender = 'male' | 'female' | 'unisex';

export type ClotheCategory = 'hair' | 'head' | 'top' | 'bottom' | 'shoes';

export type SkinMaskItem = {
  id: string;
  url?: string;
  position?: readonly [x: number, y: number];
};

export type ClotheItem = {
  id: string;
  url?: string | null;
  name?: string;
  masks?: string[];
  colorMasks?: string[];
  headMasks?: string[];
  category?: ClotheCategory;
  gender?: ClotheGender;
  bone?: CharacterBone;
  position?: Vector3Array | Vector3;
  rotation?: EulerArray | QuaternionArray | Euler | Quaternion;
};

export type PlayerClotheItem = {
  id: string;

  color?: ColorType;

  materialTextures?: Record<string, string>;

  materialColors?: Record<string, ColorType>;

  maskColors?: Record<string, ColorType>;

  headMaskColors?: Record<string, ColorType>;
};

type PlayerClotheType = string | PlayerClotheItem;

export type PlayerOutfit<T = PlayerClotheType> = {
  id: string;
  name: string;
  male: T[];
  female: T[];
};
