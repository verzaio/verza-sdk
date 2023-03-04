import {useControllerProp} from './useControllerProp';
import {useUI} from './useUI';

export const useInterfaces = () => {
  return useControllerProp(useUI().controller, 'interfaces');
};
