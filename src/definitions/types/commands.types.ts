import {CommandType} from '../enums/commands.enums';

export type CommandInfo = {
  command: string;

  desc?: string | null;

  params: CommandParam[];

  tag?: string;
};

export type CommandParam = {
  name: string;

  display?: string | null;

  type: keyof typeof CommandType;

  isRequired: boolean;
};

export type EncryptedCommands = {
  [name: string]: [string, string[]];
};
