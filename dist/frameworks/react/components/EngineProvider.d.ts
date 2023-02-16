import React, { PropsWithChildren } from 'react';
import { EngineParams } from '../../../definitions/local/types/engine.types';
import EngineManager from '../../../managers/engine.manager';
export declare const EngineContext: React.Context<EngineManager>;
export type EngineProviderProps = {
    params?: EngineParams;
};
export declare const EngineProvider: ({ children, params, }: PropsWithChildren<EngineProviderProps>) => JSX.Element | null;
