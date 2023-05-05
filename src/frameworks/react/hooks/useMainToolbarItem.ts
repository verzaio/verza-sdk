import {useEffect} from 'react';

import {MainToolbarItem} from 'engine/definitions/types/ui.types';

import {useUI} from './useUI';

export const useMainToolbarItem = (item: MainToolbarItem) => {
  const ui = useUI();

  // create or update
  useEffect(() => {
    ui.addMainToolbarItem(item);
  }, [ui, item]);

  // unmount
  useEffect(() => {
    return () => {
      ui.removeMainToolbarItem(item.id);
    };
  }, [item.id]);
};
