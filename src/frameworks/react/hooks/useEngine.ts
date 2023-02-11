import {EngineContext} from '../EngineProvider';

import {useContext} from 'react';

export const useEngine = () => {
  return useContext(EngineContext);
};
