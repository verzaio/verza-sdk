import {useEffect, useRef} from 'react';

import {EngineScriptEventMap} from 'engine/definitions/local/types/events.types';

import {useEngine} from './useEngine';

export const useEvent = <
  T extends keyof EngineScriptEventMap = keyof EngineScriptEventMap,
  P extends EngineScriptEventMap[T] = EngineScriptEventMap[T],
>(
  event: T,
  callback: P,
) => {
  const engine = useEngine();

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const onEvent = engine.events.on(event, (...args: any[]) => {
      return (callbackRef.current as any)(...args);
    });

    return () => {
      engine.events.off(event, onEvent);
    };
  }, [engine, event]);
};
