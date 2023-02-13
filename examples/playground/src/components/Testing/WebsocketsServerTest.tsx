import {Command, CommandParam, EngineManager} from '@verza/sdk';
import {useEffect} from 'react';

const WebsocketsServerTest = () => {
  // websockets server
  useEffect(() => {
    const engine = new EngineManager({
      name: 'Websocket Server',
      accessToken: process.env['NEXT_PUBLIC_VERZA_ACCESS_TOKEN'],
      apiEndpoint: 'http://localhost',
    });

    engine.connectServer();

    const onSynced = engine.events.on('onSynced', () => {
      console.debug('onSynced called');
    });

    // command
    engine.commands.register(
      new Command('server', [new CommandParam('param', 'string')]).onExecution(
        player => {
          player.sendMessage(`Hey from server`);
        },
      ),
    );

    const callback = () => {
      const player = engine.players.get(1);
      if (!player) return;

      //player.setName(`${Math.random()}`);
      //player.setDimension(player.dimension === 0 ? 1 : 0);

      //engine.restartServer();
    };

    const intervalId = setInterval(callback, 5000);

    return () => {
      clearInterval(intervalId);

      engine.events.off('onSynced', onSynced);

      engine.destroy();
    };
  }, []);

  return null;
};

export default WebsocketsServerTest;
