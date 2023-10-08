import {useEffect} from 'react';

import {ToolbarElement} from 'engine/definitions/types/ui.types';
import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

export const useToolbar = (toolbar: ToolbarElement) => {
  const {ui} = useEngine();

  // create or update
  useEffect(() => {
    ui.addToolbar(toolbar);
  }, [ui, toolbar]);

  // unmount
  useEffect(() => {
    return () => {
      ui.removeToolbar(toolbar.id);
    };
  }, [ui, toolbar.id]);
};
