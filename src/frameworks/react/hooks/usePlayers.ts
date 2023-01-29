import useEngine from './useEngine';

const usePlayers = () => {
  return useEngine().entities.player;
};

export default usePlayers;
