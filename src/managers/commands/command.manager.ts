import {
  MAX_COMMAND_DESC,
  MAX_COMMAND_NAME,
} from 'engine/definitions/constants/commands.constants';
import {CommandType} from 'engine/definitions/enums/commands.enums';
import {
  CommandInfo,
  CommandParam as CommandParamBase,
} from 'engine/definitions/types/commands.types';

import PlayerManager from '../entities/players/player/player.manager';

type ParamsList<Params extends CommandParam[] = CommandParam[]> = {
  [K in Params[number]['name']]: ReturnType<
    Extract<Params[number], {name: K}>['parse']
  >;
};

export class Command<Params extends CommandParam[] = CommandParam[]>
  implements CommandInfo
{
  command: Readonly<string> = null!;

  desc: string = null!;

  params: Params = [] as unknown as Params;

  callback: (player: PlayerManager, params: ParamsList<Params>) => void = null!;

  constructor(commandOrParams: string | CommandInfo, params?: Params) {
    if (typeof commandOrParams === 'string') {
      this.command = commandOrParams;

      // restore params
      if (params) {
        this.params = params.map(
          param => new CommandParam(param, param.type),
        ) as unknown as Params;
      }
    } else {
      // extract
      const {params, ...rest} = commandOrParams;

      // restore props
      Object.assign(this, rest);

      // restore params
      if (params) {
        this.params = params.map(
          param => new CommandParam(param, param.type),
        ) as unknown as unknown as Params;
      }
    }

    // validate lengths
    this._validateLengths();
  }

  private _validateLengths() {
    // limit name
    if (this.command.length > MAX_COMMAND_NAME) {
      this.command = this.command.substring(0, MAX_COMMAND_NAME);
    }

    if (this.desc?.length > MAX_COMMAND_DESC) {
      this.desc = this.desc.substring(0, MAX_COMMAND_DESC);
    }
  }

  on(callback: this['callback']) {
    this.callback = callback;

    return this;
  }

  withDesc(desc: string) {
    this.desc = desc;

    if (this.desc?.length > MAX_COMMAND_DESC) {
      this.desc = this.desc.substring(0, MAX_COMMAND_DESC);
    }

    return this;
  }

  process(player: PlayerManager, command: string) {
    // check for usage
    if (
      (!this.params.length && command.length) ||
      (this.params.length && !command.length)
    ) {
      this._sendUsage(player);
      return;
    }

    // no params?
    if (!this.params.length) {
      this.callback?.(player, {} as ParamsList<Params>);
      return;
    }

    // validate params
    let parts = command.split(' ');

    // check minimum required params
    if (parts.length < this.params.length) {
      this._sendUsage(player);
      return;
    }

    const isLastString = this.params[this.params.length - 1].type === 'string';

    // check if too many params
    if (!isLastString && parts.length > this.params.length) {
      this._sendUsage(player);
      return;
    }

    // check if last string param must be concatenated
    if (isLastString && parts.length > this.params.length) {
      if (this.params.length === 1) {
        parts = [parts.join(' ')];
      } else {
        parts = [...parts.splice(0, this.params.length - 1), parts.join(' ')];
      }
    }

    // check again
    if (parts.length !== this.params.length) {
      this._sendUsage(player);
      return;
    }

    const params = {} as ParamsList<Params>;

    const paramError = parts.find((value, index) => {
      (params as any)[this.params[index].name] =
        this.params[index].parse(value);

      if ((params as any)[this.params[index].name] === undefined) {
        return true;
      }

      return false;
    });

    if (paramError) {
      this._sendUsage(player);
      return;
    }

    this.callback?.(player, params);
  }

  _sendUsage(player: PlayerManager) {
    if (this.params.length) {
      const params = this.params.map(e => `[${e.display ?? e.name}]`).join(' ');
      player.sendMessage(`{c5c5c5}Usage: /${this.command} ${params}`);
      return;
    }

    player.sendMessage(`{c5c5c5}Usage: /${this.command}`);
  }

  toObject(): CommandInfo {
    return {
      command: this.command,

      desc: this.desc,

      params: this.params.map(e => e.toObject()),
    };
  }
}

export type CommandTypeCast = {
  float: number;
  number: number;
  string: string;
  user: PlayerManager;
};

export class CommandParam<
  Type extends keyof typeof CommandType = keyof typeof CommandType,
  Name extends string = string,
> implements CommandParamBase
{
  name: Name = null!;

  display: string = null!;

  type: Readonly<keyof typeof CommandType> = 'string';

  isRequired = true;

  constructor(nameOrParams: Name | CommandParamBase, type: Type) {
    if (typeof nameOrParams === 'string') {
      this.name = nameOrParams;

      if (type) {
        this.type = type;
      }
    } else {
      Object.assign(this, nameOrParams);
    }

    this._validateLengths();
  }

  private _validateLengths() {
    if (this.name.length > MAX_COMMAND_NAME) {
      this.name = this.name.substring(0, MAX_COMMAND_NAME) as Name;
    }

    if (this.display?.length > MAX_COMMAND_NAME) {
      this.display = this.display.substring(0, MAX_COMMAND_NAME);
    }
  }

  parse(input: string): CommandTypeCast[Type] {
    let value: any = undefined;

    switch (this.type) {
      case 'float': {
        value = parseFloat(input);

        if (value === Infinity || isNaN(value)) {
          return undefined!;
        }
        break;
      }
      case 'number': {
        value = parseInt(input);

        if (value === Infinity || isNaN(value)) {
          return undefined!;
        }
        break;
      }
      case 'string': {
        value = input;
        break;
      }
      case 'user': {
        // TODO: Implement
        return undefined!;
      }
    }

    return value;
  }

  optional() {
    this.isRequired = false;

    return this;
  }

  withDisplay(display: string) {
    this.display = display.substring(0, MAX_COMMAND_NAME);

    return this;
  }

  toObject(): CommandParamBase {
    return {
      name: this.name,

      display: this.display,

      type: this.type,

      isRequired: this.isRequired,
    };
  }
}
