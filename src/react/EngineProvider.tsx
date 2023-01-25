import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {EngineManager} from '..';
import useControllerProp from './hooks/misc/useControllerProp';

export const EngineContext = createContext<EngineManager>(null!);

type EngineProviderProps = {
  engine: EngineManager;
};

const EngineProvider = ({
  engine,
  children,
}: PropsWithChildren<EngineProviderProps>) => {
  const connected = useControllerProp(engine.controller, 'connected');

  // handle engine creation
  useEffect(() => {
    engine.connect();

    return () => {
      engine.destroy();
    };
  }, [engine]);

  if (!connected) return null;

  return (
    <EngineContext.Provider key={Math.random()} value={engine}>
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  return useContext(EngineContext);
};

export default EngineProvider;
