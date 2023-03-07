import {useEffect} from 'react';

export const useFrame = (callback: (delta: number) => void) => {
  useEffect(() => {
    let lastTime = performance.now();

    let frameLoop = 0;
    const check = () => {
      frameLoop = requestAnimationFrame(delta => {
        callback((delta - lastTime) / 100);

        lastTime = delta;

        check();
      });
    };

    check();

    return () => {
      cancelAnimationFrame(frameLoop);
    };
  }, [callback]);
};
