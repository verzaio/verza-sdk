import useControllerProp from './useControllerProp';
import useEngine from './useEngine';

const usePlayerId = () => {
  return useControllerProp(useEngine().controller, 'playerId');
};

export default usePlayerId;
