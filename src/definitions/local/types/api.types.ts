import {PacketEvent} from 'engine/definitions/enums/networks.enums';

export type ServerEndpointPacket = [PacketEvent, any, string];

export type ServerScope = 'script' | 'remote';
