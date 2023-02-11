import {useEngine} from './useEngine';

export const useCamera = () => {
  return useEngine().player?.camera;
};
