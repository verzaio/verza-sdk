import EngineManager from 'engine/managers/engine.manager';
import React, {createContext, PropsWithChildren, useEffect} from 'react';
import useControllerProp from './hooks/useControllerProp';

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

export default EngineProvider;
