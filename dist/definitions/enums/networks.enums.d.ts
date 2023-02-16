import { PlayerPacketDto } from '../../generated/dtos.types';
import { EntityType } from './entities.enums';
export declare enum NetworkSyncEvent {
    SyncRequest = "s.r",
    Ready = "r",
    PlayerSet = "p.se",
    PlayerUnset = "p.un",
    PlayerUpdate = "p.u",
    PlayerVoicechat = "p.v",
    EntityStreamer = "e.s"
}
export type NetworkSyncEventMap = {
    [NetworkSyncEvent.Ready]: [];
    [NetworkSyncEvent.PlayerSet]: [packet: PlayerPacketDto];
    [NetworkSyncEvent.PlayerUnset]: [playerId: number];
    [NetworkSyncEvent.PlayerUpdate]: [packet: PlayerPacketDto];
    [NetworkSyncEvent.PlayerVoicechat]: [
        playerId1: number,
        playerId2: number,
        status: boolean
    ];
    [NetworkSyncEvent.EntityStreamer]: [
        playerId: number,
        entityId: string | number,
        entityType: keyof typeof EntityType,
        action: boolean
    ];
};
export declare enum PacketEvent {
    ScriptJoin = "s",
    ScriptAction = "a",
    Join = "j",
    Quit = "q",
    Update = "u",
    Chunk = "c",
    Voice = "v",
    Chat = "h",
    Sync = "y",
    Custom = "n",
    Discover = "d"
}
export declare enum EntityPacketAction {
    c = 0,
    d = 1,
    a = 2,
    r = 3,
    u = 4
}
export declare enum PacketId {
    unknown = 0,
    p = 1,
    s = 2,
    c = 3,
    v = 4,
    h = 5,
    y = 6,
    n = 7,
    j = 8,
    a = 9
}
export declare enum PacketSource {
    Server = 0,
    Client = 1
}
export declare enum PacketDestination {
    Server = 0,
    Client = 1
}
export declare enum StateCodeId {
    ConnectionAccepted = 0
}
