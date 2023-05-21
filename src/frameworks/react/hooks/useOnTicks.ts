import {useEffect, useRef} from 'react';

export const useOnTicks = (
  handler: () => Promise<void> | void,
  ticks: number,
) => {
  const handleRef = useRef(handler);
  handleRef.current = handler;

  useEffect(() => {
    const ticksTime = 1000 / ticks;

    let timeoutId: ReturnType<typeof setTimeout> = null!;

    const check = async () => {
      await handleRef.current();

      timeoutId = setTimeout(check, ticksTime);
    };

    check();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [ticks]);
};
