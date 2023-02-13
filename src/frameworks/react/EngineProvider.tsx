import {EngineParams} from 'engine/definitions/local/types/engine.types';

import EngineManager from 'engine/managers/engine.manager';

import {useControllerProp} from './hooks/useControllerProp';

import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';

export const EngineContext = createContext<EngineManager>(null!);

type EngineProviderProps = {
  params?: EngineParams;
};

export const EngineProvider = ({
  children,
  params,
}: PropsWithChildren<EngineProviderProps>) => {
  const [engine, setEngine] = useState<EngineManager>(null!);
  const [synced, setSynced] = useState(false);

  // handle engine creation
  useEffect(() => {
    const engine = new EngineManager(params);
    engine.connectClient();

    const onSynced = engine.events.on('onSynced', () => {
      setSynced(true);
    });

    // set engine
    setEngine(engine);

    return () => {
      engine.events.on('onSynced', onSynced);
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
