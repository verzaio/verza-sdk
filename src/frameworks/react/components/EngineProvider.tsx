import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
  memo,
} from 'react';

import {EngineParams} from 'engine/definitions/local/types/engine.types';
import EngineManager from 'engine/managers/engine.manager';

export const EngineContext = createContext<EngineManager>(null!);

export type EngineProviderProps = {
  params?: EngineParams;
};

export const EngineProvider = memo(
  ({children, params}: PropsWithChildren<EngineProviderProps>) => {
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
        engine.events.off('onSynced', onSynced);
        engine.destroy();
        setEngine(null!);
        setSynced(false);
      };
    }, []);

    return useMemo(
      () => (
        <>
          {synced && engine && (
            <EngineContext.Provider value={engine}>
              {children}
            </EngineContext.Provider>
          )}
        </>
      ),
      [engine, synced],
    );
  },
);

EngineProvider.displayName = 'EngineProvider';
