import {useStreamedEntity} from './useStreamedEntity';

export const useStreamedPlayer = (playerId: number) => {
  return useStreamedEntity(playerId, 'player');
};
