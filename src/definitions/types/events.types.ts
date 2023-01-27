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

  /* chat */
  onCommand: (text: string) => void;

  /* ui */
  onSetSize: (props: SizeProps) => void;

  onShow: () => void;

  onHide: () => void;
};
