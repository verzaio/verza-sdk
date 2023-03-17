import {PointerEventType} from 'engine/types';

export type UIPointerEvents =
  | 'onPointerMove'
  | 'onPointerDown'
  | 'onPointerUp'
  | 'onPointerEnter'
  | 'onPointerLeave';

export const POINTER_EVENTS_RELATION: Record<
  PointerEventType,
  UIPointerEvents
> = {
  pointermove: 'onPointerMove',
  pointerdown: 'onPointerDown',
  pointerup: 'onPointerUp',
  pointerenter: 'onPointerEnter',
  pointerleave: 'onPointerLeave',
};
