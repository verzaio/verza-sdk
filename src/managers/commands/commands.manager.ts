import {CommandInfo} from 'engine/definitions/types/commands.types';

import EngineManager from '../engine.manager';
import PlayerManager from '../entities/players/player/player.manager';
import {Command} from './command.manager';

class CommandsManager {
  private _engine: EngineManager;

  private _binded = false;

  commands = new Map<string, Command>();

  noAccessMessage = `{c5c5c5}You don't have access to`;

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
        this.commands.forEach(command => {
          this._registerForPlayers(command);
        });
      } else {
        // if not, then listen for it
        this._engine.events.on('onSynced', () => {
          this.commands.forEach(command => {
            this._registerForPlayers(command);
          });
        });
      }
    }

    // only websocket server
    if (this._engine.api.isWebsocketServer) {
      // register commands for player
      this._engine.players.events.on('onCreate', player => {
        if (!this._engine.synced) return; // ignore if not synced

        this.commands.forEach(command => {
          this._registerForPlayer(player, command);
        });
      });
    }

    this._engine.events.on('onChat', (text, playerId) => {
      // resolve player
      const player =
        playerId !== undefined
          ? this._engine.players.get(playerId)
          : this._engine.localPlayer;

      if (!player) {
        console.debug(`[chat] playerId: ${playerId} not found`);
        return;
      }

      // check if is a command
      if (text.startsWith('/') === false || text.startsWith('/+') === true) {
        return;
      }

      // ignore if '/'
      if (text.length === 1) return;

      // extract command name
      const command = text.substring(1);

      // find command
      const key = this._findByKey(command);

      // call it if found
      if (key) {
        // WebServer
        if (this._engine.api.isWebServer) {
          if (!this._engine.api.webServer.hasAccess(player, key)) {
            player.sendMessage(`${this.noAccessMessage} /${key}`);
            return;
          }
        } else {
          // WebSocket Server
          if (!player.hasAccess(key)) {
            player.sendMessage(`${this.noAccessMessage} /${key}`);
            return;
          }
        }

        this.commands
          .get(key)
          ?.process(player, command.substring(key.length).trim());
      } else {
        // emit command to web server if available
        if (this._engine.api.isWebServerAvailable) {
          const packet = this._findCommandPacketByKey(command);
          this._engine.api.webServer.emitChatPacket(text, packet);
        }
      }

      // emit local commands
      this._engine.events.emit('onCommand', command);
    });
  }

  private _findByKey(command: string) {
    const cmd = command.toLowerCase();

    // check if is action
    if (cmd[1] === '+') return;

    // exact match
    if (this.commands.has(cmd)) {
      return cmd;
    }

    // match with parameters
    return [...this.commands.keys()].find(key => {
      // match "/test "
      return cmd.startsWith(`${key} `);
    });
  }

  private _findCommandPacketByKey(command: string) {
    const cmd = command.toLowerCase();

    // check if is action
    if (cmd[1] === '+') return;

    const commands = this._engine.network.encryptedPackets.commands as {
      [name: string]: string;
    };

    if (!commands) return;

    // exact match
    if (commands[cmd]) {
      return commands[cmd];
    }

    // match with parameters
    const found = Object.keys(commands).find(key => {
      // match "/test "
      if (cmd.startsWith(`${key} `)) {
        return true;
      }
    });

    if (found) {
      return commands[found];
    }
  }

  private _registerForPlayers(command: Command) {
    if (this._engine.destroyed) return;

    // client
    if (this._engine.isClient) {
      this._engine.messenger.emit('registerCommand', [
        this._engine.localPlayer.id,
        command.toObject(),
        this._engine.name,
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
          this._engine.name,
        ]);
      });
    }
  }

  private _registerForPlayer(player: PlayerManager, command: Command) {
    if (this._engine.destroyed) return;

    // client
    if (this._engine.isClient) {
      this._engine.messenger.emit('registerCommand', [
        player.id,
        command.toObject(),
        this._engine.name,
      ]);
      return;
    }

    // websocket server
    if (this._engine.api.isWebsocketServer) {
      // emit to players
      this._engine.api.emitActionToServer('registerCommand', [
        player.id,
        command.toObject(),
        this._engine.name,
      ]);
    }
  }

  private _unregisterForPlayers(command: Command) {
    if (this._engine.destroyed) return;

    // if client
    if (this._engine.isClient) {
      this._engine.messenger.emit('unregisterCommand', [
        this._engine.localPlayer.id,
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

  private _unregisterForPlayer(player: PlayerManager, command: Command) {
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
    this.commands.set(command.command.toLowerCase(), command);

    // emit only if synced
    if (this._engine.synced) {
      this._registerForPlayers(command);
    }
  }

  unregister(command: Command<any>) {
    if (!this.commands.has(command.command.toLowerCase())) return;

    this.commands.delete(command.command.toLowerCase());

    // emit only if synced
    if (this._engine.synced) {
      this._unregisterForPlayers(command);
    }
  }

  registerWebServerCommand(command: CommandInfo) {
    this._engine.messenger.emit('registerCommand', [
      this._engine.localPlayer.id,
      command,
      command.tag ?? this._engine.name,
    ]);
  }

  destroy() {
    this._binded = false;
  }
}

export default CommandsManager;
