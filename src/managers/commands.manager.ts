import {CommandCallback} from 'engine/definitions/types/commands.types';
import EngineManager from './engine.manager';

class CommandsManager {
  private _engine: EngineManager;

  private _commands = new Map<string, CommandCallback>();

  constructor(engine: EngineManager) {
    this._engine = engine;

    this._bind();
  }

  private _bind() {
    this._engine.events.on('onChat', text => {
      // check if is a command
      if (text.startsWith('/') === false) return;

      // ignore if '/'
      if (text.length === 1) return;

      // extract command name
      const command = text.substring(1);

      // find command
      const key = [...this._commands.keys()].find(key =>
        key.startsWith(command),
      );

      // call it if found
      if (key) {
        this._commands.get(key)?.();
      }

      // emit
      this._engine.events.emit('onCommand', command);
    });
  }

  add(command: string, callback: CommandCallback) {
    this._commands.set(command, callback);
  }

  remove(command: string) {
    this._commands.delete(command);
  }
}

export default CommandsManager;
