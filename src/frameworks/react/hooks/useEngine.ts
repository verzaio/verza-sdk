import {useContext} from 'react';

import {EngineContext} from '../components/EngineContext';

export const useEngine = () => {
  return useContext(EngineContext);
};
