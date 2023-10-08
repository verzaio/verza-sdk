import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

import {useControllerProp} from './useControllerProp';

export const useInterfaces = () => {
  return useControllerProp(useEngine().ui.controller, 'interfaces');
};
