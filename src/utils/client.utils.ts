declare global {
  interface Window {
    __VITE_CLIENTS: {
      [key: string]: boolean;
    };
  }
}

export const isViteDevMode = () =>
  typeof window !== 'undefined' &&
  import.meta &&
  import.meta.env?.MODE === 'development';

export const initViteClient = async () => {
  if (!isViteDevMode()) return;

  window.__VITE_CLIENTS = window.__VITE_CLIENTS ?? {};

  const url = new URL(import.meta.url);

  const TAG_ID = `${url.host}-vite-client`;

  // @vite/client
  if (!window.__VITE_CLIENTS[TAG_ID]) {
    window.__VITE_CLIENTS[TAG_ID] = true;

    try {
      await import(
        /* @vite-ignore */
        `${url.origin}/@vite/client`
      );
    } catch (error) {
      delete window.__VITE_CLIENTS[TAG_ID];
      throw error;
    }
  }
};
