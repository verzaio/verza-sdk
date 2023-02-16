import { ANIMATIONS } from '../../../../definitions/constants/animations.constants';
import PlayerManager from './player.manager';
declare class PlayerAnimationsManager {
    stateAnimIndex: number;
    get stateAnim(): keyof typeof ANIMATIONS | null;
    private _player;
    constructor(player: PlayerManager, initAnim?: number);
}
export default PlayerAnimationsManager;
