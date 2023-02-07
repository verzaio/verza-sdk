import {Command, CommandParam, EngineManager} from '@verza/sdk';

export const initWebServer = (engine: EngineManager) => {
  // command
  engine.commands.register(
    new Command('abc', [
      new CommandParam('name', 'string'),
      new CommandParam('age', 'number'),
    ]).onExecution((player, {name, age}) => {
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

  // event listener
  engine.network.onPlayerEvent('onClientToWebServer', data => {
    const {name} = engine.z
      .object({
        name: engine.z.string(),
      })
      .parse(data);

    console.log('HELLOOOO!', name);

    engine.network.emitToPlayers('onWebServerReceived', {
      hey: 'emitToPlayers received? (onWebServerReceived)',
    });

    engine.player.sendMessage(`Hey ${name}! Name: {red,name=1} {white}Test`);
  });
};
