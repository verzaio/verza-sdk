import '@app/styles/globals.css';
import type {AppProps} from 'next/app';
import {EngineManager, EngineProvider} from '@verza/sdk';

const engine = new EngineManager();

export default function App({Component, pageProps}: AppProps) {
  return (
    <EngineProvider engine={engine}>
      <Component {...pageProps} />
    </EngineProvider>
  );
}
