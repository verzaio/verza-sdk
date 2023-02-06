import {} from 'engine/definitions/types/commands.types';
import Command from './command.manager';
import EngineManager from '../engine.manager';

class CommandsManager {
  private _engine: EngineManager;

  private _commands = new Map<string, Command>();

  private _binded = false;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    if (this._binded) return;

    this._binded = true;

    this._engine.events.on('onChat', (text, playerId) => {
      // resolve player
      const player =
        playerId !== undefined
          ? this._engine.players.get(playerId)
          : this._engine.player;

      if (!player) {
        console.debug(`[chat] playerId: ${playerId} not found`);
        return;
      }
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
          ?.process(player, command.substring(key.length).trim());
      } else {
        // emit command to http server if not found in local
        if (this._engine.api.isHttpServerAvailable) {
          this._engine.api.httpServer.emitChatPacket(text);
        }
      }

      // emit local commands
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

  register(command: Command<any>) {
    this._commands.set(command.command.toLowerCase(), command);

    this._engine.messenger.emit('registerCommand', [command.toObject()]);

    // try to bind
    this.bind();
  }

  unregister(command: Command<any>) {
    this._commands.delete(command.command.toLowerCase());

    this._engine.messenger.emit('unregisterCommand', [command.command]);
  }

  destroy() {
    this._binded = false;
  }
}

export default CommandsManager;
