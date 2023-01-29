import {usePlayerId, useStreamedPlayer, useUI} from '@verza/sdk';
import {useEffect} from 'react';
import {Vector3} from 'three';

const PlayersTest = () => {
  const ui = useUI();
  const player = useStreamedPlayer(usePlayerId());

  useEffect(() => {
    //
  }, [player]);

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

      <br />
    </div>
  );
};

export default PlayersTest;
