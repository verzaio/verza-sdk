import {PointerEventType} from 'engine/types';

export type InputPointerEvents =
  | 'onPointerMove'
  | 'onPointerDown'
  | 'onPointerUp'
  | 'onPointerEnter'
  | 'onPointerLeave';

export const POINTER_EVENTS_RELATION: Record<
  PointerEventType,
  InputPointerEvents
> = {
  pointermove: 'onPointerMove',
  pointerdown: 'onPointerDown',
  pointerup: 'onPointerUp',
  pointerenter: 'onPointerEnter',
  pointerleave: 'onPointerLeave',
};
