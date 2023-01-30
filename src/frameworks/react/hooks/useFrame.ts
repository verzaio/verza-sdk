import {useEffect} from 'react';
import useEvent from './useEvent';

const useFrame = (callback: (delta: number) => void) => {
  // TODO: Use remote?
  //useEvent('onFrame', callback);

  useEffect(() => {
    let lastTime = performance.now();
    let running = true;

    const check = () => {
      requestAnimationFrame(delta => {
        if (!running) return;

        try {
          callback((delta - lastTime) / 100);
        } catch (e) {
          console.log(e);
        }

        lastTime = delta;

        check();
      });
    };

    check();

    return () => {
      running = false;
    };
  }, [callback]);
};

export default useFrame;
