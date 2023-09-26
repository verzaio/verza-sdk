import React, {PropsWithChildren, useEffect, useState, memo} from 'react';

import EngineManager from 'engine/managers/engine.manager';

import {useEngine} from '../hooks/useEngine';
import {EngineContext} from './EngineContext';

export type EngineProviderProps = {
  engine?: EngineManager;
};

export const EngineProvider = memo(
  ({engine: engineProp, children}: PropsWithChildren<EngineProviderProps>) => {
    const [connected, setConnected] = useState(true);

    const engineContext = useEngine();

    const engine = engineProp ?? engineContext;

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

    return (
      <EngineContext.Provider value={engine ?? engineContext}>
        {children}
      </EngineContext.Provider>
    );
  },
);

EngineProvider.displayName = 'EngineProvider';
