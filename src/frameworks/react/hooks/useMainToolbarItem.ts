import {useEffect} from 'react';

import {MainToolbarItem} from 'engine/definitions/types/ui.types';
import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

export const useMainToolbarItem = (item: MainToolbarItem) => {
  const {ui} = useEngine();

  // create or update
  useEffect(() => {
    ui.addMainToolbarItem(item);
  }, [ui, item]);

  // unmount
  useEffect(() => {
    return () => {
      ui.removeMainToolbarItem(item.id);
    };
  }, [ui, item.id]);
};
