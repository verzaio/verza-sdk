import {CommandCallback} from 'engine/definitions/types/commands.types';
import Command from './command.manager';
import EngineManager from '../engine.manager';

class CommandsManager {
  private _engine: EngineManager;

  private _commands = new Map<string, Command>();

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
      const key = this.findByKey(command);

      // call it if found
      if (key) {
        this._commands
          .get(key)
          ?.process(this._engine, command.substring(key.length).trim());
      }

      // emit
      this._engine.events.emit('onCommand', command);
    });
  }

  findByKey(command: string) {
    const cmd = command.toLowerCase();

    // exact match
    if (this._commands.has(cmd.toLowerCase())) {
      return cmd;
    }

    // match with parameters
    return [...this._commands.keys()].find(key => {
      // match "/test "
      if (cmd.startsWith(`${key} `)) {
        return true;
      }
    });
  }

  add(command: Command<any>) {
    this._commands.set(command.command.toLowerCase(), command);

    this._engine.messenger.emit('onAddCommand', [command.toObject()]);
  }

  remove(command: Command<any>) {
    this._commands.delete(command.command.toLowerCase());

    this._engine.messenger.emit('onRemoveCommand', [command.command]);
  }
}

export default CommandsManager;
