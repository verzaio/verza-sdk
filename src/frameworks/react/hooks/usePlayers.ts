import {useEngine} from './useEngine';

export const usePlayers = () => {
  return useEngine().entities.player;
};
