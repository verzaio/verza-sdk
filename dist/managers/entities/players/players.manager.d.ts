import { PlayerPacketDto } from '../../../generated/dtos.types';
import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import PlayerManager from './player/player.manager';
declare class PlayersManager extends EntitiesManager<PlayerManager> {
    private _binded;
    private get _messenger();
    constructor(engine: EngineManager);
    load(): void;
    unload(): void;
    handlePacket(playerId: number, packet: PlayerPacketDto): void;
    private _updateStateAnimIndex;
    private _updateState;
    sendMessageToAll(text: string): void;
    sendMessageTo(player: PlayerManager | number, text: string): void;
}
export default PlayersManager;
