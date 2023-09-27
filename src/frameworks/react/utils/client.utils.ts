import React, {ReactNode} from 'react';

import {createRoot} from 'react-dom/client';

import {EngineParams} from 'engine/definitions/local/types/engine.types';
import {EngineProvider} from 'engine/frameworks/react/components/EngineProvider';
import {createEngineManager} from 'engine/utils/misc.utils';

import {initViteClient, isViteDevMode} from '../../../utils/client.utils';

declare global {
  interface Window {
    $RefreshReg$: () => void;
    $RefreshSig$: () => (type: unknown) => unknown;

    __vite_plugin_react_preamble_installed__: boolean;
  }
}

const REACT_REFRESH_URL = '/@react-refresh';

export const createReactEngineManager = async (
  importUrl: string,
  params: EngineParams = {},
): Promise<(children: ReactNode) => Promise<void>> => {
  const engine = await createEngineManager(importUrl, params);

  //

  await initViteClient(importUrl);
  await initReactRefreshClient(importUrl);

  //

  const root = createRoot(engine.domElement);

  //

  engine.events.on('onDisconnect', () => {
    root.unmount();
  });

  //

  return async (children: ReactNode) => {
    root.render(React.createElement(EngineProvider, {engine}, children));
  };
};

export const initReactRefreshClient = async (baseUrl: string) => {
  if (!isViteDevMode()) return;

  await initViteClient(baseUrl);

  const url = new URL(baseUrl);

  const reactRefreshClientId = `${url.host}-react-refresh`;

  window.__VITE_CLIENTS = window.__VITE_CLIENTS ?? {};

  // react-refresh
  if (!window.__VITE_CLIENTS[reactRefreshClientId]) {
    const {
      default: {injectIntoGlobalHook},
    } = await import(/* @vite-ignore */ REACT_REFRESH_URL);

    injectIntoGlobalHook(window);

    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => type => type;

    window.__vite_plugin_react_preamble_installed__ = true;

    window.__VITE_CLIENTS[reactRefreshClientId] = true;
  }
};
