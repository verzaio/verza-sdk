import '@app/styles/globals.css';
import type {AppProps} from 'next/app';
import {EngineProvider} from '@verza/sdk';

export default function App({Component, pageProps}: AppProps) {
  return (
    <EngineProvider
      params={{
        name: 'Testing App',
        webServer: 'api/verza',
      }}>
      <Component {...pageProps} />
    </EngineProvider>
  );
}
