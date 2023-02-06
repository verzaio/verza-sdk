import {useKey, useNetwork, usePlayerId, useStreamedPlayer} from '@verza/sdk';
import {useEffect} from 'react';
import {Vector3} from 'three';

const PlayersTest = () => {
  const player = useStreamedPlayer(usePlayerId());
  const network = useNetwork();

  useEffect(() => {
    const onTesting = network.onPlayerEvent('onTesting', (player, data) => {
      console.log('player', player.name, data);
    });

    return () => {
      network.offPlayerEvent('onTesting', onTesting);
    };
  }, [network]);

  useKey('KeyU', () => {
    network.emitToPlayers('onTesting', {hello: 'Hey!'});
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
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
    </div>
  );
};

export default PlayersTest;
