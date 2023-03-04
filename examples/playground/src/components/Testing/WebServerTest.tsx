import {useEffect} from 'react';

import {useEngine} from '@verza/sdk/react';

const WebServerTest = () => {
  const engine = useEngine();

  // client
  useEffect(() => {
    engine.network.emitToServer('onClientToWebServer', {
      name: 'Mike',
    });

    const onWebServerReceived = engine.network.onServerEvent(
      'onWebServerReceived',
      async data => {
        console.log('onWebServerReceived', data);
      },
    );

    return () => {
      engine.network.offServerEvent('onWebServerReceived', onWebServerReceived);
    };
  }, [engine]);

  return null;
};

export default WebServerTest;
