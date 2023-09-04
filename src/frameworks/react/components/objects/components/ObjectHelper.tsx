import {useEffect} from 'react';

import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

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
