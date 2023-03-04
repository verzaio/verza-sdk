import {useLocalPlayerId} from './useLocalPlayerId';
import {useStreamedEntity} from './useStreamedEntity';

export const useStreamedLocalPlayer = () => {
  return useStreamedEntity(useLocalPlayerId(), 'player')!;
};
