import {usePlayerId, useStreamedPlayer} from '@verza/sdk';
import {Vector3} from 'three';

const PlayersTest = () => {
  const player = useStreamedPlayer(usePlayerId());

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      <br />

      <button
        onClick={() => {
          player.setPosition(player.location.translateZ(1).position, true);
        }}>
        player.setPosition
      </button>

      <button
        onClick={() => {
          player.setRotation(
            player.rotation.setFromAxisAngle(new Vector3(0, 1, 0), 10),
            false,
          );
        }}>
        player.setRotation
      </button>

      <button
        onClick={() => {
          player.setFacingAngle(player.getFacingAngle() + 50, false);
        }}>
        player.setFacingAngle
      </button>

      <button
        onClick={() => {
          player.setCameraBehind();
        }}>
        player.setCameraBehind
      </button>

      <button
        onClick={() => {
          player.setName(`Hey ${Math.random()}`);
        }}>
        player.setName
      </button>

      <br />
    </div>
  );
};

export default PlayersTest;
