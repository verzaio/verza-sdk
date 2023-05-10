import {PlayerPacketDto} from 'engine/generated/dtos.types';

import SubscriberTracker from '../utils/SubscriberTracker';
import PlayerManager from './player/player.manager';
import PlayersManager from './players.manager';

class PlayersHandlerManager {
  private _players: PlayersManager;

  private _tracker: SubscriberTracker<PlayerManager['events']>;

  private get _engine() {
    return this._players.engine;
  }

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(_players: PlayersManager) {
    this._players = _players;

    this._tracker = new SubscriberTracker();
  }

  bind() {
    // client side updates
    if (this._engine.isClient) {
      // updates
      if (this._engine.syncPlayerUpdates) {
        this._messenger.events.on(
          'onPlayerUpdate',
          ({data: [playerId, packet]}) => {
            this._players.handlePacket(playerId, packet as PlayerPacketDto);
          },
        );
      }

      // controls
      if (this._engine.syncPlayerControls) {
        this._messenger.events.on(
          'onControlChange',
          ({data: [key, newState]}) => {
            if (this._engine.localPlayer) {
              this._engine.localPlayer.controls[key] = newState;
            }
          },
        );
      }

      // watch events
      this._players.eventsToWatch = new Set(['onAnimation', 'onUpdate']);

      this._players.watcher.on('onAnimation', (player, subscribed) => {
        this._tracker.track(
          !!player.events.listenerCount('onAnimation'),
          'onAnimation',
          player.id,
          subscribed,
          () =>
            this._engine.events.on(
              `onPlayerAnimation_${player.id}`,
              player._onAnimation,
            ),
          () =>
            this._engine.events.off(
              `onPlayerAnimation_${player.id}`,
              player._onAnimation,
            ),
        );
      });

      this._players.watcher.on('onUpdate', (player, subscribed) => {
        this._tracker.track(
          !!player.events.listenerCount('onUpdate'),
          'onUpdate',
          player.id,
          subscribed,
          () => this._engine.events.on(`OPU_${player.id}`, player._onUpdate),
          () => this._engine.events.off(`OPU_${player.id}`, player._onUpdate),
        );
      });
    }

    this._messenger.events.on('setPlayerName', ({data: [playerId, name]}) => {
      this._players.get(playerId)?.updateName(name);
    });

    this._messenger.events.on(
      'onPlayerCreate',
      ({data: [playerId, data, streamed]}) => {
        const player = this._players.create(playerId, data);

        // stream
        if (streamed) {
          this._players.streamIn(player);
        }
      },
    );

    this._messenger.events.on('onPlayerDestroy', ({data: [playerId]}) => {
      this._players.destroy(this._players.get(playerId));
    });

    this._messenger.events.on(
      'onPlayerStreamIn',
      ({data: [playerId, data]}) => {
        this._players.streamIn(this._players.get(playerId), data);
      },
    );

    this._messenger.events.on('onPlayerStreamOut', ({data: [playerId]}) => {
      this._players.streamOut(this._players.get(playerId));
    });
  }

  unbind() {
    // remove all events
    this._players.events.removeAllListeners();
    this._players.watcher.removeAllListeners();
  }
}

export default PlayersHandlerManager;
