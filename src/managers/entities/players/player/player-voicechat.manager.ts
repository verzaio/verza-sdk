import PlayerManager from './player.manager';

class PlayerVoicechatManager {
  private _player: PlayerManager;

  connectedPlayers: Set<PlayerManager> = new Set();

  constructor(player: PlayerManager) {
    this._player = player;
  }

  addPlayer(player: PlayerManager) {
    this.connectedPlayers.add(player);
  }

  removePlayer(player: PlayerManager) {
    this.connectedPlayers.add(player);
  }

  connect(player: PlayerManager) {
    this.addPlayer(player);
    player.voicechat.addPlayer(this._player);
  }

  disconnect(player: PlayerManager) {
    this.removePlayer(player);
    player.voicechat.removePlayer(this._player);
  }
}

export default PlayerVoicechatManager;
