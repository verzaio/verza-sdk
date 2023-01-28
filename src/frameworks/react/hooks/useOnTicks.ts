import {useEffect} from 'react';

// handle player updates
const useOnTicks = (handler: () => Promise<void> | void, ticks: number) => {
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> = null!;

    const check = () => {
      handler?.();

      intervalId = setTimeout(check, 1000 / ticks);
    };

    check();

    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, [handler, ticks]);
};

export default useOnTicks;
