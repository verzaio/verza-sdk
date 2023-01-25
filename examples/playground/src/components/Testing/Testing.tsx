import {useEngine} from '@verza/sdk';

import {useCallback} from 'react';

const Testing = () => {
  const engine = useEngine();
  engine;

  const onPress = useCallback(() => {
    alert('clicked!');
  }, []);

  return (
    <div style={{display: 'flex'}}>
      <button onClick={onPress}>Click me!</button>
    </div>
  );
};

export default Testing;
