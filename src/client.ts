export {createClientEngineManager} from './client/client';
export {createReactEngineManager} from './client/react';

declare global {
  interface Window {
    __VITE_CLIENTS: {
      [key: string]: boolean;
    };

    $RefreshReg$: () => void;
    $RefreshSig$: () => (type: unknown) => unknown;

    __vite_plugin_react_preamble_installed__: boolean;
  }
}
