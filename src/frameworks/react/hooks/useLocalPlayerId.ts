import {useControllerProp} from './useControllerProp';
import {useEngine} from './useEngine';

export const useLocalPlayerId = () => {
  return useControllerProp(useEngine().controller, 'playerId');
};
