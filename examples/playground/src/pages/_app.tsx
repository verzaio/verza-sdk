import '@app/styles/globals.css';
import type {AppProps} from 'next/app';
import {EngineProvider} from '@verza/sdk/react';

export default function App({Component, pageProps}: AppProps) {
  return (
    <EngineProvider
      params={{
        name: 'Testing App',

        // web server
        webServer: 'api/verza',

        // flags
        //syncPlayerUpdatesPriority: true,
        syncCameraPosition: true,
      }}>
      <Component {...pageProps} />
    </EngineProvider>
  );
}
