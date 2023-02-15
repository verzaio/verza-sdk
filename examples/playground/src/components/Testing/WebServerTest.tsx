import {useEngine} from '@verza/sdk';
import {useEffect} from 'react';

const WebServerTest = () => {
  const engine = useEngine();

  // client
  useEffect(() => {
    engine.network.emitToServer('onClientToWebServer', {
      name: 'Mike',
    });

    const onWebServerReceived = engine.network.onServerEvent(
      'onWebServerReceived',
      data => {
        console.log('onWebServerReceived', data);
      },
    );

    return () => {
      engine.network.offServerEvent('onWebServerReceived', onWebServerReceived);
    };
  }, [engine.player, engine.network]);

  return null;
};

export default WebServerTest;
