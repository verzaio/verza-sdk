import {useEffect} from 'react';

import {INTERFACE_OPTIONS} from 'engine/definitions/constants/ui.constants';
import {KeyInfo} from 'engine/definitions/types/ui.types';

import {useEngine} from './useEngine';

type UseKeyOptions = {
  event?: 'keydown' | 'keyup';
  ignoreFlags?: boolean;

  ignoreControls?: boolean;
  ignoreActiveInput?: boolean;
  ignoreOptionsMenu?: boolean;
};

export const useGameKey = (
  key: string | string[],
  callback: (event: KeyInfo) => void,
  options?: UseKeyOptions,
) => {
  const engine = useEngine();

  useEffect(() => {
    const eventType = options?.event ?? 'keydown';
    const keys = Array.isArray(key) ? key : [key];

    const onKeyPress = engine.events.on('onKey', keyInfo => {
      if (eventType !== keyInfo.type) return;

      // check matches
      if (!keys.includes(keyInfo.code)) return;

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

      // call it
      callback(keyInfo);
    });

    return () => {
      engine.events.off('onKey', onKeyPress);
    };
  }, [engine, callback, key, options]);
};
