import {EngineParams} from 'engine/definitions/local/types/engine.types';
import {createEngineManager} from 'engine/utils/misc.utils';

declare global {
  interface Window {
    __VITE_CLIENTS: {
      [key: string]: boolean;
    };
  }
}

const REACT_CLIENT_URL = '/@vite/client';

export const isViteDevMode = () =>
  import.meta && import.meta.env?.MODE === 'development';

export const createClientEngineManager = async (
  importUrl: string,
  params: EngineParams = {},
) => {
  const engine = await createEngineManager(importUrl, params);

  await initViteClient(importUrl);

  return engine;
};

export const initViteClient = async (importUrl: string) => {
  if (!isViteDevMode()) return;

  const url = new URL(importUrl);

  const viteClientId = `${url.host}-vite-client`;

  window.__VITE_CLIENTS = window.__VITE_CLIENTS ?? {};

  // @vite/client
  if (!window.__VITE_CLIENTS[viteClientId]) {
    await import(
      /* @vite-ignore */
      REACT_CLIENT_URL
    );

    window.__VITE_CLIENTS[viteClientId] = true;
  }
};
