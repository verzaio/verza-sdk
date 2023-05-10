export type ClotheCategory = 'top';

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
};

export type PlayerClotheItem = {
  id: string;
};
