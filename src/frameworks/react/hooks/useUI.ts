import useControllerProp from './useControllerProp';
import useEngine from './useEngine';

const useUI = () => {
  return useEngine().ui;
};

export const useCursorLock = () => {
  return useControllerProp(useUI().controller, 'cursorLock');
};

export const useInterfaces = () => {
  return useControllerProp(useUI().controller, 'interfaces');
};

export default useUI;
