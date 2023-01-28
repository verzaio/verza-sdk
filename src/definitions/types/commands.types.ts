import Command from 'engine/managers/commands/command.manager';
import {CommandType} from '../enums/commands.enums';

export type CommandCallback = (params: Command) => void;

export type CommandInfo = {
  command: string;

  desc: string;

  params: CommandParam[];
};

export type CommandParam = {
  name: string;

  display: string;

  type: keyof typeof CommandType;

  isRequired: boolean;
};
