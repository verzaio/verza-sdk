import { PacketEvent } from '../../../definitions/enums/networks.enums';
export type ServerEndpointPacket = [
    event: PacketEvent,
    data: any,
    auth: string,
    command: string
];
export type ServerScope = 'script' | 'remote';
