import {useEngine} from 'engine/framework-react';

import {useControllerProp} from './useControllerProp';

export const useCursorLock = () => {
  return useControllerProp(useEngine().input.controller, 'cursorLock');
};
