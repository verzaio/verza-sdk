import {useEvent, useKey, useUI, useWorld} from '@verza/sdk/react';

const InterfaceTest = () => {
  const ui = useUI();
  const world = useWorld();

  const onPressed = () => {
    ui.toggleInterface('test');

    world.setEntitySelector(ui.hasInterface('test'));
  };

  useKey('KeyY', onPressed);

  useEvent('onEntitySelected', intersects => {
    console.log('intersects', intersects);
  });

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
