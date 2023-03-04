import {useNetwork, useStreamedLocalPlayer} from '@verza/sdk/react';

const Playground = () => {
  const player = useStreamedLocalPlayer();
  const network = useNetwork();

  player;
  network;

  return null;
};

export default Playground;
