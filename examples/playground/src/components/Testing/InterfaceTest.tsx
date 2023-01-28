import {useEngine, useKey} from '@verza/sdk';

const InterfaceTest = () => {
  const engine = useEngine();

  const onPressed = () => {
    if (engine.ui.hasInterface('test')) {
      engine.ui.removeInterface('test');
      return;
    }

    engine.ui.addInterface('test');
  };

  useKey('KeyY', onPressed);

  return (
    <div onClick={onPressed} style={{display: 'flex'}}>
      <button>Hello moto</button>
    </div>
  );
};

export default InterfaceTest;
