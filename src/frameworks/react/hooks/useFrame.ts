import {useEvent} from './useEvent';

export const useFrame = (callback: (delta: number) => void) => {
  useEvent('onFrame', callback);
};
