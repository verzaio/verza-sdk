import {ColorType} from './ui.types';

export type ClotheGender = 'male' | 'female' | 'unisex';

export type ClotheCategory = 'top' | 'bottom' | 'foot' | 'head';

export type SkinMaskItem = {
  id: string;
  url?: string;
  position?: readonly [x: number, y: number];
};

export type ClotheItem = {
  id: string;
  url: string;
  name?: string;
  masks?: string[];
  category?: ClotheCategory;
  gender?: ClotheGender;
};

export type PlayerClotheItem = {
  id: string;

  color?: ColorType;
};

type PlayerClotheType = string | PlayerClotheItem;

export type PlayerOutfit<T = PlayerClotheType> = {
  id: string;
  name: string;
  male: T[];
  female: T[];
};
