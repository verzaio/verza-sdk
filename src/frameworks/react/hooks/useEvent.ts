import {CommandCallback} from 'engine/definitions/types/commands.types';
import {ScriptEventMap} from 'engine/definitions/types/events.types';
import {useEffect} from 'react';
import useEngine from './useEngine';

const useEvent = <
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

export default useEvent;
