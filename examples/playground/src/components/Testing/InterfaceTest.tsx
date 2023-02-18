import {
  useEngine,
  useEvent,
  useKey,
  useObjects,
  useUI,
  useWorld,
} from '@verza/sdk/react';
import {useEffect} from 'react';

const InterfaceTest = () => {
  const ui = useUI();
  const world = useWorld();
  const objects = useObjects();
  const engine = useEngine();

  const onPressed = () => {
    ui.toggleInterface('test');

    world.setEntitySelector(ui.hasInterface('test'));

    if (!ui.hasInterface('test')) {
      objects.cancelEdit();
    }
  };

  useKey('KeyY', onPressed);

  useEvent('onEntitySelected', intersects => {
    console.log('intersects', intersects);

    intersects.object?.entity.edit();
  });

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
