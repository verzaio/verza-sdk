import {createContext} from 'react';

import {EngineManager} from 'engine/managers/engine.manager';

export const EngineContext = createContext<EngineManager>(null!);
