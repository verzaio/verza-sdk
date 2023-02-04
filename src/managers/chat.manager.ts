import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';

class ChatManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  // client & server
  sendMessage(text: string) {
    if (this._engine.isServer) {
      if (!this._engine.player) return;

      this._engine.api.emitChat(text, this._engine.player.id);
      return;
    }

    this._messenger.emit('onSendMessage', [text]);
  }

  // server only
  sendMessageToPlayer(player: PlayerManager | number, text: string) {
    if (!this._engine.isServer) return;

    this._engine.api.emitChat(
      text,
      typeof player === 'number' ? player : player.id,
    );
  }

  // server only
  sendMessageToAll(text: string) {
    if (!this._engine.isServer) return;

    this._engine.api.emitChat(text);
  }
}

export default ChatManager;
