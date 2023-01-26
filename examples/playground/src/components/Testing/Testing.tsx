import {useEngine, SizeProps} from '@verza/sdk';

import {useCallback, useEffect} from 'react';

const Testing = () => {
  const engine = useEngine();

  useEffect(() => {
    engine.ui.setSize({
      height: '150px',
      width: '150px',
      top: '10vw',
      right: '10vh',
    });
    engine.ui.show();
  }, [engine]);

  return (
    <div onClick={() => engine.ui.hide()} style={{display: 'flex'}}>
      <button>Hello moto</button>
    </div>
  );
};

export default Testing;
