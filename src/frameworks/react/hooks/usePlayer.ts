import {useEntity} from './useEntity';

export const usePlayer = (id: number) => {
  return useEntity(id, 'player');
};
