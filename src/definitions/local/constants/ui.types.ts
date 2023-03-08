import {PointerEventType} from 'engine/types';

import {ObjectEventMap} from '../types/events.types';

export const POINTER_EVENTS_RELATION: Record<
  PointerEventType,
  keyof ObjectEventMap
> = {
  pointermove: 'onPointerMove',
  pointerdown: 'onPointerDown',
  pointerup: 'onPointerUp',
  pointerenter: 'onPointerEnter',
  pointerleave: 'onPointerLeave',
};
