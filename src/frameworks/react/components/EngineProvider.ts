import React, {
  PropsWithChildren,
  useEffect,
  useState,
  memo,
  useContext,
  createContext,
} from 'react';

import EngineManager from 'engine/managers/engine.manager';

export const EngineContext = createContext<EngineManager>(null!);

export type EngineProviderProps = {
  engine?: EngineManager;
};

export const EngineProvider = memo(
  ({engine: engineProp, children}: PropsWithChildren<EngineProviderProps>) => {
    const [connected, setConnected] = useState(true);

    const currentContext = useEngine();

    const engine = engineProp ?? currentContext;

    // handle disconnect
    useEffect(() => {
      const onDisconnect = engine.events.on('onDisconnect', () => {
        setConnected(false);
      });

      return () => {
        engine.events.off('onDisconnect', onDisconnect);
        setConnected(false);
      };
    }, [engine]);

    if (!connected) return null;

    return React.createElement(
      EngineContext.Provider,
      {value: engine},
      children,
    );
  },
);

export const useEngine = () => {
  return useContext(EngineContext);
};

EngineProvider.displayName = 'EngineProvider';
