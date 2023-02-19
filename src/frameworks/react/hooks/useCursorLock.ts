import {useControllerProp} from './useControllerProp';
import {useUI} from './useUI';

export const useCursorLock = () => {
  return useControllerProp(useUI().controller, 'cursorLock');
};
