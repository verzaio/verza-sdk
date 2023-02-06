import {CHAT_INPUT_DELIMITER_REGEX} from 'engine/definitions/constants/chat.constants';
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

  escapeText(text?: string) {
    return (text ?? '')?.replaceAll(CHAT_INPUT_DELIMITER_REGEX, '');
  }

  // server only
  sendMessageToAll(text: string) {
    if (!this._engine.isServer) return;

    this._engine.api.emitAction('sendMessage', [text]);
  }

  sendMessageTo(player: PlayerManager | number, text: string) {
    if (!this._engine.isServer) return;

    const playerId = typeof player === 'number' ? player : player.id;

    this._engine.api.emitAction('sendMessage', [text, playerId]);
  }
}

export default ChatManager;
