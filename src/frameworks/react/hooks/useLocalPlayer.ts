import {useLocalPlayerId} from './useLocalPlayerId';
import {usePlayer} from './usePlayer';

export const useLocalPlayer = () => {
  return usePlayer(useLocalPlayerId())!;
};
