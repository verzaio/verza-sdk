import {useEffect, useMemo, useRef} from 'react';

import {KeyEvent, KeyEventType} from 'engine/definitions/types/input.types';

import {useEngine} from './useEngine';

type UseKeyOptions = {
  event?: KeyEventType;
  ignoreFlags?: boolean;

  ignoreActiveInput?: boolean;
};

const EventsRelation: Record<KeyEventType, 'onKeyUp' | 'onKeyDown'> = {
  keyup: 'onKeyUp',
  keydown: 'onKeyDown',
};

export const useKey = (
  key: string | string[],
  callback: (event: KeyEvent) => void,
  options?: UseKeyOptions,
) => {
  const engine = useEngine();

  const keysRef = useRef(key);
  keysRef.current = key;

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const eventType = useMemo(
    () => EventsRelation[options?.event ?? 'keyup'],
    [options?.event],
  );

  useEffect(() => {
    const onKeyPress = engine.events.on(eventType, (event: KeyEvent) => {
      const keys = Array.isArray(keysRef.current)
        ? keysRef.current
        : [keysRef.current];

      // check matches
      if (!keys.includes(event.code)) return;

      const options = optionsRef.current;

      // ignore controls
      if (!options?.ignoreFlags) {
        if (!options?.ignoreActiveInput && event.activeInput) {
          return;
        }
      }

      // call it
      callbackRef.current(event);
    });

    return () => {
      engine.events.off(eventType, onKeyPress);
    };
  }, [engine, eventType]);
};
