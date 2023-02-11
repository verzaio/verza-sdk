import {useControllerProp} from './useControllerProp';
import {useEngine} from './useEngine';

export const usePlayerId = () => {
  return useControllerProp(useEngine().controller, 'playerId');
};
