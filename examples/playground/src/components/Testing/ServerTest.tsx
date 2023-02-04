import {useEngine} from '@verza/sdk';
import {useEffect} from 'react';

const ServerTest = () => {
  const engine = useEngine();

  useEffect(() => {
    engine.network.emitToServer('onTestingEmit', {
      name: 'Mike',
    });
  }, []);

  return null;
};

export default ServerTest;
