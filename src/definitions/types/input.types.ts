export type KeyEventType = 'keydown' | 'keyup';

export type InputEvent = {
  altKey?: boolean;

  ctrlKey?: boolean;

  metaKey?: boolean;

  shiftKey?: boolean;

  activeInput?: boolean;
};

export type KeyEvent = {
  type: KeyEventType;

  code: string;

  key: string;
} & InputEvent;

export type PointerEventType =
  | 'pointermove'
  | 'pointerdown'
  | 'pointerup'
  | 'pointerenter'
  | 'pointerleave';

export type PointerEvent = {
  type: PointerEventType;

  pointerType: string;

  x: number;

  y: number;

  button: number;

  buttons: number;

  source?: string;
} & InputEvent;

export type DragEventType = 'dragover' | 'dragenter' | 'dragleave' | 'drop';

export type DragEvent = {
  type: DragEventType;

  x: number;

  y: number;

  button: number;

  buttons: number;

  source?: string;
} & InputEvent;

export type FileTransfer = {
  name: string;
  type: string;
  size: number;
  buffer: ArrayBuffer;
};
