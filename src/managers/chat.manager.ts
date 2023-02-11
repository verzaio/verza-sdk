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
    return (text ?? '')?.replace(CHAT_INPUT_DELIMITER_REGEX, '');
  }

  // server only
  sendMessageToAll(text: string) {
    if (!this._engine.isServer) {
      throw new Error('sendMessageToAll is only available on server-side');
    }

    this._engine.api.emitAction('sendMessage', [text]);
  }

  sendMessageTo(player: PlayerManager | number, text: string) {
    const playerId = typeof player === 'number' ? player : player.id;

    this._engine.api.emitAction('sendMessage', [text, playerId]);
  }
}

export default ChatManager;
