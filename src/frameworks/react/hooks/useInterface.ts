import {useEffect, useState} from 'react';

import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

export const useInterface = (tag: string): boolean => {
  const {ui} = useEngine();

  const [enabled, setEnabled] = useState(() =>
    ui.controller.interfaces.has(tag),
  );

  useEffect(() => {
    // check if value has changed
    setEnabled(ui.controller.interfaces.has(tag));

    const onChange = ui.controller.events.on('interfaces', interfaces => {
      setEnabled(interfaces.has(tag));
    });

    return () => {
      ui.controller.events.off('interfaces', onChange);
    };
  }, [ui.controller, tag]);

  return enabled;
};
