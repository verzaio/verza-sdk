import { Socket } from 'socket.io-client';
import { ScriptEventMap } from '../../../definitions/types/scripts.types';
import { ServerDto, ScriptSyncPacketDto, ScriptActionPacketDto } from '../../../generated/dtos.types';
import EngineManager from '../../../managers/engine.manager';
import SyncManager from './sync.manager';
export type PacketDto = ScriptSyncPacketDto | ScriptActionPacketDto;
declare class WebsocketServerManager {
    private _engine;
    socket: Socket;
    server: ServerDto;
    sync: SyncManager;
    private _scriptsRoomId;
    private get endpoint();
    private get _accessToken();
    constructor(engine: EngineManager);
    private _fetchServer;
    _cleanup(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): void;
    emitAction<A extends keyof ScriptEventMap>(eventName: A, args?: Parameters<ScriptEventMap[A]>): Promise<void>;
    private _handlePacket;
}
export default WebsocketServerManager;
