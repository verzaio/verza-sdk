import { CommandType } from '../../definitions/enums/commands.enums';
import { CommandInfo, CommandParam as CommandParamBase } from '../../definitions/types/commands.types';
import PlayerManager from '../entities/players/player/player.manager';
type ParamsList<Params extends CommandParam[] = CommandParam[]> = {
    [K in Params[number]['name']]: ReturnType<Extract<Params[number], {
        name: K;
    }>['parse']>;
};
export declare class Command<Params extends CommandParam[] = CommandParam[]> implements CommandInfo {
    command: Readonly<string>;
    desc: string;
    params: Params;
    callback: (player: PlayerManager, params: ParamsList<Params>) => void;
    constructor(commandOrParams: string | CommandInfo, params?: Params);
    private _validateLengths;
    on(callback: this['callback']): this;
    withDesc(desc: string): this;
    process(player: PlayerManager, command: string): void;
    _sendUsage(player: PlayerManager): void;
    toObject(): CommandInfo;
}
export type CommandTypeCast = {
    number: number;
    string: string;
    user: number;
};
export declare class CommandParam<Type extends keyof typeof CommandType = keyof typeof CommandType, Name extends string = string> implements CommandParamBase {
    name: Name;
    display: string;
    type: Readonly<keyof typeof CommandType>;
    isRequired: boolean;
    constructor(nameOrParams: Name | CommandParamBase, type: Type);
    private _validateLengths;
    parse(input: string): CommandTypeCast[Type];
    required(): this;
    withDisplay(display: string): this;
    toObject(): CommandParamBase;
}
export {};
