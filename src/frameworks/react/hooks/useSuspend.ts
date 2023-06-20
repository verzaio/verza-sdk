import {useEffect, useRef} from 'react';

import {clear, suspend} from 'suspend-react';

type Tuple<T = any> = [T] | T[];

type Await<T> = T extends Promise<infer V> ? V : never;

export const useSuspend = <
  Keys extends Tuple<unknown>,
  Fn extends () => Promise<unknown>,
>(
  fn: Fn,
  keys: Keys,
) => {
  const keysRef = useRef(keys);

  const result = suspend(() => {
    if (keysRef.current !== keys) {
      clear(keysRef.current);
      keysRef.current = keys;
    }

    return fn();
  }, keys);

  useEffect(() => {
    return () => {
      clear(keysRef.current);
    };
  }, []);

  return result as Await<ReturnType<Fn>>;
};
