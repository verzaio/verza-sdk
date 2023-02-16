import {useContext} from 'react';

import {EngineContext} from '../components/EngineProvider';

export const useEngine = () => {
  return useContext(EngineContext);
};
