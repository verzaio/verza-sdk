export const setReactRef = (ref: any, value: unknown) => {
  if (ref) {
    ref.current = value;
  }
};
