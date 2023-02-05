import {EngineManager, useEngine} from '@verza/sdk';
import {useEffect} from 'react';

const ServerTest = () => {
  const engine = useEngine();

  // servdr
  useEffect(() => {
    const serverEngine = new EngineManager({
      accessToken: process.env['NEXT_PUBLIC_VERZA_ACCESS_TOKEN'],
      apiEndpoint: 'http://localhost',
    });

    console.log('creating');
    serverEngine.connectServer();

    return () => {
      console.log('destroying');
      serverEngine.destroy();
    };
  }, []);

  // client
  useEffect(() => {
    engine.network.emitToServer('onTestingEmit', {
      name: 'Mike',
    });

    const onTestingReceived = engine.network.onServerEvent(
      'onTestingReceived',
      data => {
        //console.log('onTestingReceived2', data);
      },
    );

    return () => {
      engine.network.offServerEvent('onTestingReceived', onTestingReceived);
    };
  }, []);

  return null;
};

export default ServerTest;
