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

export type KeyEvent = 'keydown' | 'keyup';

export type KeyInfo = {
  type: KeyEvent;

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

export type PointerEventType = 'pointermove' | 'pointerdown' | 'pointerup';

export type PointerEvent = {
  type: PointerEventType;
  x: number;
  y: number;
};

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
