import {useEffect, useMemo, useRef} from 'react';

import {KeyEvent} from 'engine/definitions/types/ui.types';

import {useEngine} from './useEngine';

type UseKeyOptions = {
  event?: 'keydown' | 'keyup';
  ignoreFlags?: boolean;

  ignoreControls?: boolean;
  ignoreActiveInput?: boolean;
  ignoreOptionsMenu?: boolean;
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
    () => (options?.event === 'keyup' ? 'onKeyDown' : 'onKeyUp'),
    [options?.event],
  );

  useEffect(() => {
    const keys = Array.isArray(key) ? key : [key];

    const onKeyPress = engine.events.on(eventType, (event: KeyEvent) => {
      // check matches
      if (!keys.includes(event.code)) return;

      const options = optionsRef.current;

      // disabled when options menu is enabled
      if (!options?.ignoreOptionsMenu && engine.ui.isOptionsMenu()) {
        return;
      }

      // ignore controls
      if (!options?.ignoreFlags) {
        /* if (!options?.ignoreControls && !engine.player?.canControl) {
          return;
        } */

        if (!options?.ignoreActiveInput && engine.ui.isActiveInput) {
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
