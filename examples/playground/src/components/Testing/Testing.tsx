import {useCommand, useEngine} from '@verza/sdk';

import {useEffect} from 'react';

const Testing = () => {
  const engine = useEngine();

  useEffect(() => {
    engine.ui.setSize({
      height: '150px',
      width: '150px',
      top: '10vw',
      right: '10vh',
    });
    //engine.ui.show();
  }, [engine]);

  // test cmd
  useCommand('test', () => {
    console.log('Command executed!');
  });

  return (
    <div onClick={() => engine.ui.hide()} style={{display: 'flex'}}>
      <button>Hello moto</button>
    </div>
  );
};

export default Testing;
