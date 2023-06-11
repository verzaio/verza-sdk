import {useEngine, useKey} from '@verza/sdk/react';
import {useEffect} from 'react';

const InterfaceTest = () => {
  const engine = useEngine();

  const {ui} = engine;

  const onPressed = () => {
    ui.toggleInterface('test_interface');
  };

  useKey('KeyY', onPressed);

  useEffect(() => {
    const onChange = engine.events.on('onObjectEdit', (_, type) => {
      console.log('onObjectEdit', type);
    });

    return () => {
      engine.events.off('onObjectEdit', onChange);
    };
  }, [engine]);

  return (
    <>
      <br />
      <div onClick={onPressed} style={{display: 'flex'}}>
        <button>Toggle Key Y</button>
      </div>
    </>
  );
};

export default InterfaceTest;
