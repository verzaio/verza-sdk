import {INTERFACE_OPTIONS} from 'engine/definitions/constants/ui.constants';
import {KeyInfo} from 'engine/definitions/types/ui.types';
import {useCallback, useEffect} from 'react';
import useEngine from './useEngine';
import useGameKey from './useGameKey';

type UseKeyOptions = {
  event?: 'keydown' | 'keyup';
  ignoreFlags?: boolean;

  ignoreControls?: boolean;
  ignoreActiveInput?: boolean;
  ignoreOptionsMenu?: boolean;
};

const useKey = (
  key: string | string[],
  callback: (event: KeyInfo) => void,
  options?: UseKeyOptions,
) => {
  const engine = useEngine();

  useGameKey(key, callback, options);

  useEffect(() => {
    const event = options?.event ?? 'keydown';
    const keys = Array.isArray(key) ? key : [key];

    const onKeyDown = (event: KeyboardEvent) => {
      // disabled when options menu is enabled
      if (
        !options?.ignoreOptionsMenu &&
        engine.ui.hasInterface(INTERFACE_OPTIONS)
      ) {
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

      // check matches
      if (keys.includes(event.code)) {
        callback({
          type: event.type as KeyInfo['type'],

          code: event.code,

          key: event.key,

          altKey: event.altKey,

          ctrlKey: event.ctrlKey,

          metaKey: event.metaKey,

          shiftKey: event.shiftKey,
        });
      }
    };

    document.addEventListener(event, onKeyDown);

    return () => {
      document.removeEventListener(event, onKeyDown);
    };
  }, [engine, callback, key, options]);
};

export default useKey;
