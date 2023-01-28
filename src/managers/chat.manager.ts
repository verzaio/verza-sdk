import EngineManager from './engine.manager';

class ChatManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  sendMessage(text: string) {
    this._messenger.emit('onSendMessage', [text]);
  }
}

export default ChatManager;
