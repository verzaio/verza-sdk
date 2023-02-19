import {useEffect} from 'react';

import {ToolbarElement} from 'engine/definitions/types/ui.types';

import {useUI} from './useUI';

export const useToolbar = (toolbar: ToolbarElement) => {
  const ui = useUI();

  useEffect(() => {
    ui.addToolbar(toolbar);

    return () => {
      ui.removeToolbar(toolbar.id);
    };
  }, [ui, toolbar]);
};
