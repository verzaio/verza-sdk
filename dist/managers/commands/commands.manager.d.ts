import { CommandInfo } from '../../definitions/types/commands.types';
import EngineManager from '../engine.manager';
import PlayerManager from '../entities/players/player/player.manager';
import { Command } from './command.manager';
declare class CommandsManager {
    private _engine;
    commands: Map<string, Command<import("./command.manager").CommandParam<"string" | "number" | "user", string>[]>>;
    private _binded;
    noAccessMessage: string;
    constructor(engine: EngineManager);
    private _bind;
    findByKey(command: string): string | undefined;
    findCommandPacketByKey(command: string): string | undefined;
    registerForPlayers(command: Command): void;
    registerForPlayer(player: PlayerManager, command: Command): void;
    unregisterForPlayers(command: Command): void;
    unregisterForPlayer(player: PlayerManager, command: Command): void;
    register(command: Command<any>): void;
    unregister(command: Command<any>): void;
    registerWebServerCommand(command: CommandInfo): void;
    destroy(): void;
}
export default CommandsManager;
