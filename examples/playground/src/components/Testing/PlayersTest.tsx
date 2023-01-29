import {usePlayerId, useStreamedPlayer, useUI} from '@verza/sdk';
import {useEffect} from 'react';

const PlayersTest = () => {
  const ui = useUI();
  const player = useStreamedPlayer(usePlayerId());

  useEffect(() => {
    //
  }, [player]);

  return null;
};

export default PlayersTest;
