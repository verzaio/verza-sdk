import React, {ReactNode} from 'react';

import {createRoot} from 'react-dom/client';

import {EngineParams} from 'engine/definitions/local/types/engine.types';
import {EngineProvider} from 'engine/frameworks/react/components/EngineProvider';
import {EngineManager} from 'engine/index';
import {initEngine} from 'engine/utils/client.utils';

import {isViteDevMode} from '../../../utils/vite.utils';

declare global {
  interface Window {
    $RefreshReg$: () => void;
    $RefreshSig$: () => (type: unknown) => unknown;

    __vite_plugin_react_preamble_installed__: boolean;
  }
}

export const initReactEngine = async (
  params: EngineParams | string = {},
): Promise<[(children: ReactNode) => void, EngineManager]> => {
  //

  await initReactRefreshClient();

  //

  const engine = await initEngine(params);

  const root = createRoot(engine.domElement);

  //

  engine.events.on('onDestroy', () => {
    root.unmount();
  });

  //

  return [
    (children: ReactNode) =>
      root.render(React.createElement(EngineProvider, {engine}, children)),
    engine,
  ];
};

export const initReactRefreshClient = async () => {
  if (!isViteDevMode()) return;

  window.__VITE_CLIENTS = window.__VITE_CLIENTS ?? {};

  const url = new URL(import.meta.url);

  const TAG_ID = `${url.host}-react-refresh`;

  // react-refresh
  if (!window.__VITE_CLIENTS[TAG_ID]) {
    window.__VITE_CLIENTS[TAG_ID] = true;

    try {
      const {
        default: {injectIntoGlobalHook},
      } = await import(/* @vite-ignore */ `${url.origin}/@react-refresh`);

      injectIntoGlobalHook(window);

      if (!window.$RefreshReg$) {
        window.$RefreshReg$ = () => {};
        window.$RefreshSig$ = () => type => type;
      }

      window.__vite_plugin_react_preamble_installed__ = true;
    } catch (error) {
      delete window.__VITE_CLIENTS[TAG_ID];
      throw error;
    }
  }
};
