import {useEffect, useMemo, useRef} from 'react';

import {KeyEvent} from 'engine/definitions/types/ui.types';

import {useEngine} from './useEngine';

type UseKeyOptions = {
  event?: 'keydown' | 'keyup';
  ignoreFlags?: boolean;

  ignoreActiveInput?: boolean;
};

export const useKey = (
  key: string | string[],
  callback: (event: KeyEvent) => void,
  options?: UseKeyOptions,
) => {
  const engine = useEngine();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const eventType = useMemo(
    () => (options?.event === 'keyup' ? 'onKeyUp' : 'onKeyDown'),
    [options?.event],
  );

  useEffect(() => {
    const keys = Array.isArray(key) ? key : [key];

    const onKeyPress = engine.events.on(eventType, (event: KeyEvent) => {
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
  }, [engine, key, eventType]);
};
