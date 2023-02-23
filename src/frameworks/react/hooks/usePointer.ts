import {useEffect, useMemo, useRef} from 'react';

import {
  PointerEvent,
  PointerEventType,
} from 'engine/definitions/types/ui.types';

import {useEngine} from './useEngine';

type UsePointerOptions = {
  event?: PointerEventType;
  ignoreFlags?: boolean;

  ignoreActiveInput?: boolean;
};

const EventsRelation: Record<
  PointerEventType,
  'onPointerMove' | 'onPointerDown' | 'onPointerUp'
> = {
  pointermove: 'onPointerMove',
  pointerdown: 'onPointerDown',
  pointerup: 'onPointerUp',
};

export const usePointer = (
  callback: (event: PointerEvent) => void,
  options?: UsePointerOptions,
) => {
  const engine = useEngine();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const eventType = useMemo(
    () => EventsRelation[options?.event ?? 'pointerup'],
    [options?.event],
  );

  useEffect(() => {
    const onPointerPress = engine.events.on(
      eventType,
      (event: PointerEvent) => {
        const options = optionsRef.current;

        // ignore controls
        if (!options?.ignoreFlags) {
          if (!options?.ignoreActiveInput && event.activeInput) {
            return;
          }
        }

        // call it
        callbackRef.current(event);
      },
    );

    return () => {
      engine.events.off(eventType, onPointerPress);
    };
  }, [engine, eventType]);
};
