import useEvent from './useEvent';

const useFrame = (callback: (delta: number) => void) => {
  useEvent('onFrame', callback);
};

export default useFrame;
