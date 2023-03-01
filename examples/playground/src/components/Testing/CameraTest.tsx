import {useEngine, useLocalPlayer} from '@verza/sdk/react';
import {useEffect} from 'react';

const END_TRANSITION_ID = 'end-transition';

const CameraTest = () => {
  const player = useLocalPlayer();
  const engine = useEngine();

  useEffect(() => {
    engine.events.on('onCameraTransitionEnd', id => {
      if (id === END_TRANSITION_ID) {
        player.camera.setMode('player', false);
      }
    });
  }, [engine, player]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <br />

      <button
        onClick={() => {
          player.camera.setMode('player');
        }}>
        camera.setMode(player)
      </button>

      <button
        onClick={() => {
          player.camera.setMode('world');
        }}>
        camera.setMode(world)
      </button>

      <button
        onClick={() => {
          player.camera.setMode('world');

          player.camera.setPosition({
            to: [2, 4, 10],
            lookAt: [0, 0, 0],
          });
        }}>
        camera.setPosition
      </button>

      <button
        onClick={() => {
          player.camera.setMode('world');
          player.camera.setTransitions([
            {
              to: [10, 10, 10],
              from: [10, 3, 0],
              lookAt: [0, 0, 0],
              lookAtFixed: true,
              duration: 1500,
            },
            {
              to: [15, 8, 30],
              lookAt: [0, 0, 0],
              duration: 3000,
            },
            {
              id: END_TRANSITION_ID,
              to: [0, 2, 5],
              lookAt: [0, 1, 0],
              duration: 2000,
            },
          ]);
        }}>
        camera.setTransitions
      </button>

      <button
        onClick={() => {
          player.camera.setMode('world');
          player.camera.setTransition({
            id: END_TRANSITION_ID,
            to: [10, 10, 10],
            from: [10, 3, 0],
            lookAt: [0, 0, 0],
            lookAtFixed: true,
          });
        }}>
        camera.setTransition
      </button>

      <button
        onClick={() => {
          player.camera.setMode('world');
          player.camera.setPosition({
            to: [10, 30, -10],
            lookAt: [10, 10, 0],
          });

          player.camera.setTransitions([
            {
              id: END_TRANSITION_ID,
              to: [10, 30, -10],
              from: [100, 100, -60],
              lookAt: [10, 10, 0],
              duration: 2000,
              easing: 'easeInOutQuad',
            },
          ]);
        }}>
        camera.setTransition(effect)
      </button>

      <br />
    </div>
  );
};

export default CameraTest;
