import { Vector3 } from 'three';
import { PlayerState } from '../../../../definitions/types/players.types';
import EntityHandleManager from '../../entity/entity-handle.manager';
import PlayerAnimationsManager from './player-animations.manager';
import type PlayerManager from './player.manager';
declare class PlayerHandleManager extends EntityHandleManager<PlayerManager> {
    state: PlayerState;
    velocity: Vector3;
    animations: PlayerAnimationsManager;
    onGround: boolean;
    private get _player();
    constructor(player: PlayerManager);
}
export default PlayerHandleManager;
