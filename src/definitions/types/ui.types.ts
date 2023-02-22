export type OptionsMenuTabType =
  | 'general'
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

export type SizePropValue = `${number}vh` | `${number}vw` | `${number}px`;

export type SizeProps<T extends string = SizePropValue> = {
  height: T;
  width: T;
  left?: T;
  top?: T;
  right?: T;
  bottom?: T;
  zIndex?: number;
};

export type KeyEventType = 'keydown' | 'keyup';

export type UIEventBase = {
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
} & UIEventBase;

export type PointerEventType = 'pointermove' | 'pointerdown' | 'pointerup';

export type PointerEvent = {
  type: PointerEventType;

  pointerType: string;

  x: number;

  y: number;

  button: number;

  buttons: number;
} & UIEventBase;

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
