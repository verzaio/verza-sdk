import useStreamedEntity from './useStreamedEntity';

const useStreamedPlayer = (playerId: number) => {
  return useStreamedEntity(playerId, 'player')!;
};

export default useStreamedPlayer;
