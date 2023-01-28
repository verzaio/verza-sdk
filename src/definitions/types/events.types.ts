import {CommandInfo} from './commands.types';
import {KeyInfo} from './ui.types';

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
  onKey: (keyInfo: KeyInfo) => void;

  onAddInterface: (tag: string) => void;

  onRemoveInterface: (tag: string) => void;

  onCursorLock: (status: boolean) => void;

  onSetSize: (props: SizeProps) => void;

  onShow: () => void;

  onHide: () => void;
};
