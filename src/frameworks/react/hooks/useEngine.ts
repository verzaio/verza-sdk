import {useContext} from 'react';
import {EngineContext} from '../EngineProvider';

const useEngine = () => {
  return useContext(EngineContext);
};

export default useEngine;
