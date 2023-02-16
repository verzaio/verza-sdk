import { ScriptEventMap } from '../../../../definitions/types/scripts.types';
import PlayerManager from './player.manager';
declare class PlayerMessengerManager {
    private _player;
    constructor(player: PlayerManager);
    emit<A extends keyof ScriptEventMap>(eventName: A, args?: Parameters<ScriptEventMap[A]>): Promise<void>;
}
export default PlayerMessengerManager;
