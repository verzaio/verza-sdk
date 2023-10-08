import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

import {useControllerProp} from './useControllerProp';

export const useCursorLock = () => {
  return useControllerProp(useEngine().input.controller, 'cursorLock');
};
