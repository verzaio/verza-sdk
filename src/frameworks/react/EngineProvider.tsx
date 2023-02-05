import {EngineParams} from 'engine/definitions/local/types/engine.types';
import EngineManager from 'engine/managers/engine.manager';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import useControllerProp from './hooks/useControllerProp';

export const EngineContext = createContext<EngineManager>(null!);

type EngineProviderProps = {
  params?: EngineParams;
};

const EngineProvider = ({
  children,
  params,
}: PropsWithChildren<EngineProviderProps>) => {
  const [engine, setEngine] = useState<EngineManager>(null!);
  const [synced, setSynced] = useState(false);

  // handle engine creation
  useEffect(() => {
    const engine = new EngineManager(params);
    engine.connectClient();

    const onSynced = engine.controller.events.on('synced', status => {
      setSynced(status);
    });

    // set engine
    setEngine(engine);

    return () => {
      engine.controller.events.on('synced', onSynced);
      engine.destroy();
      setEngine(null!);
      setSynced(false);
    };
  }, []);

  if (!synced || !engine) return null;

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
};

export default EngineProvider;
