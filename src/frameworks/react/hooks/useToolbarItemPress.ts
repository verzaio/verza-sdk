import {useEvent} from './useEvent';

export const useToolbarItemPress = (
  id: string,
  callback: (id: string, toolbarId: string) => void,
) => {
  useEvent('onToolbarItemPress', (toolbarItemId, toolbarId) => {
    if (toolbarItemId === id) {
      callback(id, toolbarId);
    }
  });
};
