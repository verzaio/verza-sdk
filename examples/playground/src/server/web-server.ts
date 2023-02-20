import {Command, CommandParam, EngineManager} from '@verza/sdk';

export const initWebServer = (engine: EngineManager) => {
  // command
  engine.commands.register(
    new Command('abc', [
      new CommandParam('name', 'string'),
      new CommandParam('age', 'number'),
    ]).on((player, {name, age}) => {
      console.log('executed!!', name, age);

      player.sendMessage(`Hey ${name} - ${age}! - sendMessage`);

      engine.players.sendMessageToAll(
        `Hey ${name} - ${age}! - sendMessageToAll`,
      );

      engine.players.sendMessageTo(
        player,
        `Hey ${name} - ${age}! - sendMessageToPlayer`,
      );
    }),
  );

  engine.commands.register(
    new Command('abc2').on(player => {
      player.sendMessage('allowed!');
    }),
  );

  engine.commands.register(new Command('+hello'));

  engine.commands.register(new Command('+hello2'));

  engine.commands.register(new Command('+hello3'));

  // event listener
  engine.network.onPlayerEvent('onClientToWebServer', async data => {
    const {name} = engine.z
      .object({
        name: engine.z.string(),
      })
      .parse(data);

    engine.network.emitToPlayers('onWebServerReceived', {
      hey: 'emitToPlayers received? (onWebServerReceived)',
    });

    engine.player.sendMessage(`Hey ${name}! Name: {red,name=1} {white}Test`);
  });
};
