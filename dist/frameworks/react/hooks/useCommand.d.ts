import { Command, CommandParam } from '../../../managers/commands/command.manager';
export declare const useCommand: <Params extends CommandParam<"string" | "number" | "user", string>[] = CommandParam<"string" | "number" | "user", string>[]>(command: string, params?: Params | undefined) => Command<Params>;
