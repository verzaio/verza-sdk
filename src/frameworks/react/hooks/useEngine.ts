import {useContext} from 'react';

import {EngineContext} from '../EngineProvider';

export const useEngine = () => {
  return useContext(EngineContext);
};
