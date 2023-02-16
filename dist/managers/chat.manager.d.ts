import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';
declare class ChatManager {
    private _engine;
    private get _messenger();
    constructor(engine: EngineManager);
    escapeText(text?: string): string;
    sendMessageToAll(text: string): void;
    sendMessageTo(player: PlayerManager | number, text: string): void;
}
export default ChatManager;
