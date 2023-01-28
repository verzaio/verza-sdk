export type KeyInfo = {
  type: 'keydown' | 'keyup';

  code: string;

  key: string;

  altKey: boolean;

  ctrlKey: boolean;

  metaKey: boolean;

  shiftKey: boolean;
};

export type IndicatorId = string | number;

export type IndicatorTitle = string | null;

export type Indicator = {
  id: IndicatorId;
  title: IndicatorTitle;
};