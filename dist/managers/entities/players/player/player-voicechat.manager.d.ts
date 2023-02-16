import PlayerManager from './player.manager';
declare class PlayerVoicechatManager {
    private _player;
    connectedPlayers: Set<PlayerManager>;
    constructor(player: PlayerManager);
    isConnected(player: PlayerManager): boolean;
    addPlayer(player: PlayerManager): void;
    removePlayer(player: PlayerManager): void;
    connect(player: PlayerManager): void;
    disconnect(player: PlayerManager): void;
}
export default PlayerVoicechatManager;
