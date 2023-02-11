import {Command, CommandParam} from 'engine/managers/commands/command.manager';

import {useEngine} from './useEngine';

import {useEffect, useState} from 'react';

export const useCommand = <Params extends CommandParam[] = CommandParam[]>(
  command: string,
  params?: Params,
) => {
  const engine = useEngine();
  const [cmd] = useState(() => {
    const cmd = new Command(command, params);
    return cmd;
  });

  useEffect(() => {
    engine.commands.register(cmd as unknown as Command);

    return () => {
      engine.commands.unregister(cmd as unknown as Command);
    };
  }, [cmd]);

  return cmd;
};
