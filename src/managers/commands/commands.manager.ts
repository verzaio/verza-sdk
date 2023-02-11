import EngineManager from '../engine.manager';
import PlayerManager from '../entities/players/player/player.manager';
import {Command} from './command.manager';

class CommandsManager {
  private _engine: EngineManager;

  private _commands = new Map<string, Command>();

  private _binded = false;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  private _bind() {
    if (this._binded) return;

    this._binded = true;

    // client & websocket server
    if (this._engine.api.isClient || this._engine.api.isWebsocketServer) {
      // if already synced
      if (this._engine.synced) {
        this._commands.forEach(command => {
          this.registerForPlayers(command);
        });
      } else {
        // if not, then listen for it
        this._engine.events.on('onSynced', () => {
          this._commands.forEach(command => {
            this.registerForPlayers(command);
          });
        });
      }
    }

    // only websocket server
    if (this._engine.api.isWebsocketServer) {
      // register commands for player
      this._engine.players.events.on('onConnect', player => {
        if (!this._engine.synced) return; // ignore if not synced

        this._commands.forEach(command => {
          this.registerForPlayer(player, command);
        });
      });
    }

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
        // emit command to web server if available
        if (this._engine.api.isWebServerAvailable) {
          this._engine.api.webServer.emitChatPacket(text);
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

  registerForPlayers(command: Command) {
    if (this._engine.destroyed) return;

    // client
    if (this._engine.isClient) {
      this._engine.messenger.emit('registerCommand', [
        this._engine.player.id,
        command.toObject(),
      ]);
      return;
    }

    // websocket server
    if (this._engine.api.isWebsocketServer) {
      const commandJson = command.toObject();

      this._engine.players.entitiesMap.forEach(player => {
        this._engine.api.emitActionToServer('registerCommand', [
          player.id,
          commandJson,
        ]);
      });
    }
  }

  registerForPlayer(player: PlayerManager, command: Command) {
    if (this._engine.destroyed) return;

    // client
    if (this._engine.isClient) {
      this._engine.messenger.emit('registerCommand', [
        player.id,
        command.toObject(),
      ]);
      return;
    }

    // websocket server
    if (this._engine.api.isWebsocketServer) {
      // emit to players
      this._engine.api.emitActionToServer('registerCommand', [
        player.id,
        command.toObject(),
      ]);
    }
  }

  unregisterForPlayers(command: Command) {
    if (this._engine.destroyed) return;

    // if client
    if (this._engine.isClient) {
      this._engine.messenger.emit('unregisterCommand', [
        this._engine.player.id,
        command.command,
      ]);
      return;
    }

    // websocket server
    if (this._engine.api.isWebsocketServer) {
      this._engine.players.entitiesMap.forEach(player => {
        this._engine.api.emitActionToServer('unregisterCommand', [
          player.id,
          command.command,
        ]);
      });
    }
  }

  unregisterForPlayer(player: PlayerManager, command: Command) {
    if (this._engine.destroyed) return;

    // client
    if (this._engine.isClient) {
      this._engine.messenger.emit('unregisterCommand', [
        player.id,
        command.command,
      ]);
      return;
    }

    // websocket server
    if (this._engine.api.isWebsocketServer) {
      this._engine.api.emitActionToServer('unregisterCommand', [
        player.id,
        command.command,
      ]);
    }
  }

  register(command: Command<any>) {
    // try to bind
    this._bind();

    // unregister in case that already added
    this.unregister(command);

    // add it
    this._commands.set(command.command.toLowerCase(), command);

    // emit only if synced
    if (this._engine.synced) {
      this.registerForPlayers(command);
    }
  }

  unregister(command: Command<any>) {
    if (!this._commands.has(command.command.toLowerCase())) return;

    this._commands.delete(command.command.toLowerCase());

    // emit only if synced
    if (this._engine.synced) {
      this.unregisterForPlayers(command);
    }
  }

  destroy() {
    this._binded = false;
  }
}

export default CommandsManager;
