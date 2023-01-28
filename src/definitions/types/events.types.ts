import {CommandInfo} from './commands.types';

/* scripts */
export type SizePropValue = `${number}vh` | `${number}vw` | `${number}px`;

export type SizeProps = {
  height: SizePropValue;
  width: SizePropValue;
  left?: SizePropValue;
  top?: SizePropValue;
  right?: SizePropValue;
  bottom?: SizePropValue;
};

export type ScriptEventMap = {
  /* chat */
  onChat: (text: string) => void;

  onSendMessage: (text: string) => void;

  onCommand: (command: string) => void;

  onCommandNotFound: (command: string) => void;

  onAddCommand: (command: CommandInfo) => void;

  onRemoveCommand: (command: string) => void;

  /* ui */
  onSetSize: (props: SizeProps) => void;

  onShow: () => void;

  onHide: () => void;
};
