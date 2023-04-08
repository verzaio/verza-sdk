import {ColorKeyword, ColorModelString, HexColorString} from 'three';

export type OptionsMenuTabType =
  | 'overview'
  | 'controls'
  | 'graphics'
  | 'audio'
  | 'chat';

export type ServerMenuTabType =
  | 'general'
  | 'members'
  | 'roles'
  | 'scripts'
  | 'commands'
  | 'keys'
  | 'banlist';

export type IndicatorId = string | number;

export type IndicatorTitle = string | null;

export type Indicator = {
  id: IndicatorId;
  title: IndicatorTitle;
};

export type UISizePropValue =
  | `${number}vh`
  | `${number}vw`
  | `${number}px`
  | `${number}%`;

export type UISizeProps<T extends string = UISizePropValue> = {
  height: T;
  width: T;
  left?: T;
  top?: T;
  right?: T;
  bottom?: T;
  zIndex?: number;
};

export type KeyEventType = 'keydown' | 'keyup';

export type UIEvent = {
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
} & UIEvent;

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
} & UIEvent;

export type ToolbarPosition = 'bottom' | 'right';

export type ToolbarItem = {
  id?: string;
  name?: string;
  key?: string | string[];
};

export type ToolbarElement = {
  id: string;
  position: ToolbarPosition;
  items: ToolbarItem[];
};

export type FileTransfer = {
  name: string;
  type: string;
  size: number;
  buffer: ArrayBuffer;
};

export type ColorType =
  | ColorKeyword
  | ColorModelString
  | HexColorString
  | number;
