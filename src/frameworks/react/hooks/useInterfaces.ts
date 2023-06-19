import {useEngine} from 'engine/framework-react';

import {useControllerProp} from './useControllerProp';

export const useInterfaces = () => {
  return useControllerProp(useEngine().ui.controller, 'interfaces');
};
