import {useEngine} from './useEngine';

export const useObjects = () => {
  return useEngine().entities.object;
};
