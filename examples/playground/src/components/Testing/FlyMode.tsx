import {Object3D, Vector3} from '@verza/sdk';
import {PlayerControls} from 'engine/definitions/types/controls.types';
import {useState} from 'react';

import {
  useCamera,
  useCommand,
  useFrame,
  useKey,
  usePlayerId,
  useStreamedPlayer,
} from '@verza/sdk/react';

const _LOCATION = new Object3D();

const _ROTATE_Y = new Vector3(0, 1, 0);

const _DIR1 = new Vector3();
const _DIR2 = new Vector3();

const MODEL_ROTATION = Math.PI; // 180 degrees

const FlyingMode = () => {
  const player = useStreamedPlayer(usePlayerId());
  const [enabled, setEnabled] = useState(false);

  const enable = () => {
    if (!player.hasAccess('fly')) return;

    const newStatus = !enabled;
    setEnabled(!enabled);

    const toggleStatus = !newStatus;

    player.setMovements(toggleStatus);
    player.setVisible(toggleStatus);
    player.setTranslations(toggleStatus, toggleStatus, toggleStatus);
    player.setLinearVelocity([0, 0, 0]);

    _LOCATION.position.copy(player.position);
    _LOCATION.quaternion.copy(player.rotation);

    if (newStatus) {
      player.sendSuccessNotification('Flying enabled');
    } else {
      player.sendErrorNotification('Flying disabled');
    }
  };

  useCommand('fly').on(() => enable());
  useKey('Tab', () => enable());

  if (!enabled) return null;

  return <FlyModeRender />;
};

const FlyModeRender = () => {
  const player = useStreamedPlayer(usePlayerId());
  const camera = useCamera();

  useFrame(delta => {
    if (!player) return;

    _LOCATION.quaternion.copy(camera.quaternion);

    const velocity = player.controls.control
      ? 40
      : player.controls.caps
      ? 3
      : 10;

    // calculate X/Y
    if (player.isMovingControl) {
      const directionOffset = calcDirectionOffset(player.controls);

      if (directionOffset === null) return;

      // get normalized direction
      camera.camera.getWorldDirection(_DIR1);
      _LOCATION.getWorldDirection(_DIR2);

      const angleYCameraDirection = Math.atan2(
        _DIR2.x - _DIR1.x,
        _DIR2.z - _DIR1.z,
      );

      const finalRotation =
        angleYCameraDirection + directionOffset + MODEL_ROTATION;

      _LOCATION.quaternion.setFromAxisAngle(_ROTATE_Y, finalRotation);

      _LOCATION.translateZ(velocity * delta);
    }

    // set up/down
    if (player.controls.jump || player.controls.sprint) {
      _LOCATION.translateY(velocity * delta * (player.controls.jump ? 1 : -1));
    }

    // set
    player.setPosition(_LOCATION.position);
  });

  return null;
};

// Thanks to https://github.com/tamani-coding/threejs-character-controls-example/blob/main/src/characterControls.ts
export const calcDirectionOffset = (controls: PlayerControls) => {
  let directionOffset = null; // w

  if (controls.forward) {
    if (controls.left) {
      directionOffset = Math.PI / 4; // w+a
    } else if (controls.right) {
      directionOffset = -Math.PI / 4; // w+d
    } else {
      directionOffset = 0;
    }
  } else if (controls.backward) {
    if (controls.left) {
      directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
    } else if (controls.right) {
      directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
    } else {
      directionOffset = Math.PI; // s
    }
  } else if (controls.left) {
    directionOffset = Math.PI / 2; // a
  } else if (controls.right) {
    directionOffset = -Math.PI / 2; // d
  }

  return directionOffset;
};

export default FlyingMode;
