import {useEntity} from './useEntity';

export const useObject = (id: string) => {
  return useEntity(id, 'object');
};
