import {useCamera, useEngine} from '@verza/sdk';
import {useEffect} from 'react';

const END_TRANSITION_ID = 'end-transition';

const CameraTest = () => {
  const camera = useCamera();
  const engine = useEngine();

  useEffect(() => {
    engine.events.on('onCameraTransitionEnd', id => {
      if (id === END_TRANSITION_ID) {
        camera.setMode('player', false);
      }
    });
  }, [engine, camera]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <br />

      <button
        onClick={() => {
          camera.setMode('player');
        }}>
        camera.setMode(player)
      </button>

      <button
        onClick={() => {
          camera.setMode('world');
        }}>
        camera.setMode(world)
      </button>

      <button
        onClick={() => {
          camera.setMode('world');

          camera.setPosition({
            to: [2, 4, 10],
            lookAt: [0, 0, 0],
          });
        }}>
        camera.setPosition
      </button>

      <button
        onClick={() => {
          camera.setMode('world');
          camera.setTransitions([
            {
              to: [10, 10, 10],
              from: [10, 3, 0],
              lookAt: [0, 0, 0],
              lookAtFixed: true,
              duration: 1500,
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
          camera.setMode('world');
          camera.setTransition({
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
          camera.setMode('world');
          camera.setPosition({
            to: [10, 30, -10],
            lookAt: [10, 10, 0],
          });

          camera.setTransitions([
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
