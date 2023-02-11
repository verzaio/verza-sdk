import {INTERFACE_OPTIONS} from 'engine/definitions/constants/ui.constants';
import {KeyInfo} from 'engine/definitions/types/ui.types';
import {useEffect} from 'react';
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
    const event = options?.event ?? 'keydown';
    const keys = Array.isArray(key) ? key : [key];

    const onKey = engine.events.on('onKey', keyInfo => {
      if (keyInfo.type !== event) return;

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
      if (keys.includes(keyInfo.code)) {
        callback(keyInfo);
      }
    });

    return () => {
      engine.events.off('onKey', onKey);
    };
  }, [engine, callback, key, options]);
};
