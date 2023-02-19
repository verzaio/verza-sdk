import {useEffect, useRef} from 'react';

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

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const onEvent = engine.events.on(event, (...args: any[]) => {
      (callbackRef.current as any)(...args);
    });

    return () => {
      engine.events.off(event, onEvent);
    };
  }, [engine]);
};
