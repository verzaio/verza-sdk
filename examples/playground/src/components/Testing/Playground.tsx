import {useNetwork, usePlayerId, useStreamedPlayer} from '@verza/sdk/react';

const Playground = () => {
  const player = useStreamedPlayer(usePlayerId());
  const network = useNetwork();

  player;
  network;

  return null;
};

export default Playground;
