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

    const onSynced = engine.events.on('onSynced', async () => {
      console.debug('onSynced called');

      /* const response = await engine.api.emitActionAsync('addInterface', [
          'a',
        ]); */
    });

    const onPlayerConnect = engine.players.events.on(
      'onConnect',
      async player => {
        player.sendMessage(`Websocket server script connected (websocket)!`);
      },
    );

    // command
    engine.commands.register(
      new Command('server', [new CommandParam('param', 'string')]).on(
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
      engine.players.events.on('onConnect', onPlayerConnect);

      engine.destroy();
    };
  }, []);

  return null;
};

export default WebsocketsServerTest;
