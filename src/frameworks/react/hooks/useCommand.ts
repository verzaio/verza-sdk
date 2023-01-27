import {CommandCallback} from 'engine/definitions/types/commands.types';
import {useEffect} from 'react';
import useEngine from './useEngine';

const useCommand = (command: string, callback: CommandCallback) => {
  const engine = useEngine();

  useEffect(() => {
    engine.commands.add(command, callback);

    return () => {
      engine.commands.remove(command);
    };
  });
};

export default useCommand;
