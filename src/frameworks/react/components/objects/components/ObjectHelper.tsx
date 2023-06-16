import {useEffect} from 'react';

import {ObjectManager} from 'engine/types';

type ObjectHelperProps = {
  object: ObjectManager;
};

export const ObjectHelper = ({object}: ObjectHelperProps) => {
  // handle
  useEffect(() => {
    object.setHelper(true);

    return () => {
      object.setHelper(false);
    };
  }, [object]);

  return null;
};
