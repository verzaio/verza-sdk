import {CommandType} from '../enums/commands.enums';

export type CommandInfo = {
  command: string;

  desc: string;

  params: CommandParam[];

  tag?: string;
};

export type CommandParam = {
  name: string;

  display: string;

  type: keyof typeof CommandType;

  isRequired: boolean;
};
