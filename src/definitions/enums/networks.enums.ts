import {PlayerPacketDto} from 'engine/generated/dtos.types';

import {ChunkIndex} from '../types/chunks.types';
import {EntityType} from './entities.enums';

export enum NetworkSyncEvent {
  SyncRequest = 's.r',

  Ready = 'r',

  Chunk = 'c',

  // player
  PlayerSet = 'p.se',
  PlayerUnset = 'p.un',

  PlayerUpdate = 'p.u',
  PlayerVoicechat = 'p.v',

  EntityStreamer = 'e.s',
}

export type NetworkSyncEventMap = {
  [NetworkSyncEvent.Ready]: [];

  // chunk
  [NetworkSyncEvent.Chunk]: [playerId: number, chunkIndex: ChunkIndex];

  // player
  [NetworkSyncEvent.PlayerSet]: [packet: PlayerPacketDto];
  [NetworkSyncEvent.PlayerUnset]: [playerId: number];

  [NetworkSyncEvent.PlayerUpdate]: [packet: PlayerPacketDto];
  [NetworkSyncEvent.PlayerVoicechat]: [
    playerId1: number,
    playerId2: number,
    status: boolean,
  ];

  [NetworkSyncEvent.EntityStreamer]: [
    playerId: number,
    entityId: string | number,
    entityType: keyof typeof EntityType,
    action: boolean,
  ];
};

export enum PacketEvent {
  /* scripts */
  ScriptJoin = 's',
  ScriptAction = 'a',

  /* player connection */
  Join = 'j', // join
  Quit = 'q', // quit

  Update = 'u', // player or entity update

  Object = 'o', // object

  Chunk = 'c', // chunk

  Voice = 'v', // voice

  Chat = 'h', // chat

  Sync = 'y', // sync

  Custom = 'n', // custom

  Discover = 'd', // discover
}

export enum EntityPacketAction {
  c = 0, // create

  d = 1, // destroy

  a = 2, // add

  r = 3, // remove

  u = 4, // update
}

export enum PacketId {
  unknown = 0, // unknown

  p = 1, // player

  s = 2, // state

  //o = 3, // reserved

  v = 4, // voice

  h = 5, // chat

  y = 6, // sync

  n = 7, // custom

  c = 20, // chunk

  j = 30, // script sync

  a = 31, // script action
}

export enum PacketSource {
  Server = 0, // server

  Client = 1, // client
}

export enum PacketDestination {
  Server = 0, // server

  Client = 1, // client
}

export enum StateCodeId {
  ConnectionAccepted = 0,
}
