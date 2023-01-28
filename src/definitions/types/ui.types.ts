export type KeyInfo = {
  type: 'keydown' | 'keyup';

  code: string;

  key: string;

  altKey: boolean;

  ctrlKey: boolean;

  metaKey: boolean;

  shiftKey: boolean;
};
