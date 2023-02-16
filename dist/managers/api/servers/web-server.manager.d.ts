import { PacketEvent } from '../../../definitions/enums/networks.enums';
import { ScriptEventMap } from '../../../definitions/types/scripts.types';
import { CustomPacketSendDto } from '../../../generated/dtos.types';
import EngineManager from '../../../managers/engine.manager';
import PlayerManager from '../../../managers/entities/players/player/player.manager';
declare class WebServerManager {
    private _engine;
    private get endpoint();
    private get _accessToken();
    declaredCommands: string[];
    commandPacket: [string, string[]];
    webServerEndpoint: string;
    get encryptedPackets(): import("../../../generated/dtos.types").EncryptedPacketsDto;
    get isServer(): boolean;
    get isClient(): boolean;
    constructor(engine: EngineManager);
    bind(): void;
    handle(rawData: unknown): Promise<unknown>;
    private _createCommandPacket;
    hasAccess(player: PlayerManager, command: string): boolean;
    private _createPlayerFromAuthPacket;
    private _isValidEndpointPacket;
    private _discoverPacket;
    private _handlePacket;
    private _parseEndpointData;
    emitToWebServer(event: PacketEvent, data?: unknown, commandPacket?: string): Promise<Response> | undefined;
    emitAction<A extends keyof ScriptEventMap>(eventName: A, args?: Parameters<ScriptEventMap[A]>): Promise<void>;
    emitDiscoverPacket(): Promise<void>;
    emitChatPacket(text: string, commandPacket?: string): void;
    emitCustomPacket(dto: CustomPacketSendDto): void;
}
export default WebServerManager;
