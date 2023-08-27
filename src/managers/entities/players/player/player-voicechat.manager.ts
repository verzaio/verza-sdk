import {VoicechatModeType} from 'engine/definitions/types/voicechat.types';

import PlayerManager from './player.manager';

class PlayerVoicechatManager {
  private _player: PlayerManager;

  private get _messenger() {
    return this._player.messenger;
  }

  constructor(player: PlayerManager) {
    this._player = player;
  }

  setPlayerToPlayerMode(
    playerId: number | PlayerManager,
    mode: VoicechatModeType | null,
  ) {
    playerId = typeof playerId === 'number' ? playerId : playerId.id;

    this._messenger.emit('setPlayerToPlayerVoicechatMode', [
      this._player.id,
      playerId,
      mode,
    ]);
  }

  enableChannel(channel: number) {
    this._messenger.emit('setPlayerVoicechatChannel', [
      this._player.id,
      channel,
      true,
    ]);
  }

  disableChannel(channel: number) {
    this._messenger.emit('setPlayerVoicechatChannel', [
      this._player.id,
      channel,
      false,
    ]);
  }

  setMuted(muted: boolean) {
    this._messenger.emit('setPlayerVoicechatMuted', [this._player.id, muted]);
  }

  async setDistance(distance: number | null) {
    await this._messenger.emit('setPlayerVoicechatDistance', [
      this._player.id,
      distance,
    ]);
  }
}

export default PlayerVoicechatManager;
