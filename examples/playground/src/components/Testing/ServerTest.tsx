import {useEngine} from '@verza/sdk';
import {useEffect} from 'react';

const ServerTest = () => {
  const engine = useEngine();

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
