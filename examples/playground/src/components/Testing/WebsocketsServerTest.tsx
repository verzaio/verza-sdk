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

      console.log('requesting object');

      const object = await engine.objects.resolveObject(
        '145bb3da-ae85-4fbb-9c3a-0e8e17f882f8',
      );

      console.log('object', object);

      const OBJECT_ID = '145bb3da-ae85-4fbb-9c3a-0e8e17f882f9';

      const created = engine.objects.createBox(
        {
          w: 1,
          h: 1,
          d: 1,
          c: 'violet',
        },
        {
          id: OBJECT_ID,
          position: [2, 3, 2],
        },
      );

      console.log('created', created);

      /* const response = await engine.api.emitActionAsync('addInterface', [
          'a',
        ]); */
    });

    const onPlayerCreate = engine.players.events.on(
      'onCreate',
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
      engine.players.events.on('onCreate', onPlayerCreate);

      engine.destroy();
    };
  }, []);

  return null;
};

export default WebsocketsServerTest;
