import {useEffect} from 'react';

import {ToolbarElement} from 'engine/definitions/types/ui.types';

import {useUI} from './useUI';

export const useToolbar = (toolbar: ToolbarElement) => {
  const ui = useUI();

  // create or update
  useEffect(() => {
    ui.addToolbar(toolbar);
  }, [ui, toolbar]);

  // unmount
  useEffect(() => {
    return () => {
      ui.removeToolbar(toolbar.id);
    };
  }, [toolbar.id]);
};
