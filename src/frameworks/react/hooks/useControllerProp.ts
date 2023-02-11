import {useEffect, useState} from 'react';

import ControllerManager from 'engine/managers/controller.manager';

export const useControllerProp = <
  T extends ControllerManager,
  V extends keyof T['data'],
>(
  controller: T,
  name: V,
) => {
  const [prop, setProp] = useState<T['data'][V]>(
    () => (controller.data as T['data'])[name],
  );

  useEffect(() => {
    // check if value has changed
    setProp((controller.data as T['data'])[name]);

    const onChange = controller.events.on(name as string, value => {
      setProp(value as T['data'][V]);
    });

    return () => {
      controller.events.off(name as string, onChange);
    };
  }, [controller, name]);

  return prop;
};
