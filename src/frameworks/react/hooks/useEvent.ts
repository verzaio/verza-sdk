import {useEffect} from 'react';

import {ScriptEventMap} from 'engine/definitions/types/scripts.types';

import {useEngine} from './useEngine';

export const useEvent = <
  T extends keyof ScriptEventMap = keyof ScriptEventMap,
  P extends ScriptEventMap[T] = ScriptEventMap[T],
>(
  event: T,
  callback: P,
) => {
  const engine = useEngine();

  useEffect(() => {
    const onEvent = engine.events.on(event, callback);

    return () => {
      engine.events.off(event, onEvent);
    };
  });
};
