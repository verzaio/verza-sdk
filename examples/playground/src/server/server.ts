import {Command, CommandParam, EngineManager} from '@verza/sdk';

export const initServer = (engine: EngineManager) => {
  // command
  engine.commands.register(
    new Command('abc', [
      new CommandParam('name', 'string'),
      new CommandParam('age', 'number'),
    ]).onExecution(({name, age}) => {
      console.log('executed!!', name, age);

      engine.player.sendMessage(`Hey ${name} - ${age}! - sendMessage`);

      engine.chat.sendMessageToAll(`Hey ${name} - ${age}! - sendMessageToAll`);

      engine.chat.sendMessageTo(
        engine.player,
        `Hey ${name} - ${age}! - sendMessageToPlayer`,
      );
    }),
  );

  // event listener
  engine.network.onServerEvent('onTestingEmit', data => {
    const {name} = engine.z
      .object({
        name: engine.z.string(),
      })
      .parse(data);

    console.log('HELLOOOO!', name);

    engine.network.emitToPlayers('onTestingReceived', {
      hey: 'emitToPlayers received?',
    });

    engine.player.sendMessage(`Hey ${name}! Name: {red,name=1} {white}Test`);
  });
};
