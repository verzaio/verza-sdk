import { CustomEventData } from '../definitions/types/scripts.types';
import { CommandConfigDto, EncryptedPacketsDto, ServerDto } from '../generated/dtos.types';
import EngineManager from './engine.manager';
import PlayerManager from './entities/players/player/player.manager';
type EventData = {
    [name: string]: unknown;
};
declare class NetworkManager {
    private _engine;
    server: ServerDto;
    serverCommands: Map<string, CommandConfigDto>;
    encryptedPackets: EncryptedPacketsDto;
    private get _api();
    private get _isClient();
    private get _isServer();
    private get _messenger();
    constructor(engine: EngineManager);
    bind(): void;
    onPlayerEvent(event: string, listener: (player: PlayerManager, data: CustomEventData) => void): (playerId: number, data?: CustomEventData | undefined) => void;
    onServerEvent(event: string, listener: (data: CustomEventData) => void): (data?: CustomEventData | undefined) => void;
    offServerEvent(event: string, listener: (data?: CustomEventData) => void): void;
    offPlayerEvent(event: string, listener: (player: number, data?: CustomEventData) => void): void;
    emitToServer(event: string, data?: EventData): void;
    emitToPlayers(event: string, data?: EventData): void;
    emitToPlayer(player: PlayerManager | number, event: string, data?: EventData): void;
    private _checkPacketSize;
}
export default NetworkManager;
