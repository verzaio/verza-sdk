import {PointerEventType} from 'engine/definitions/types/input.types';

import {InputPointerEvents} from '../types/input.types';

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
