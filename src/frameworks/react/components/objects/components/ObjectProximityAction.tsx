import {useEffect, useRef} from 'react';

import equal from 'fast-deep-equal';

import {ProximityActionOptions} from 'engine/definitions/types/world.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

type ObjectProximityActionProps = {
  object: ObjectManager;
  proximityAction: Omit<ProximityActionOptions, 'objectId'> | boolean;
};

export const ObjectProximityAction = ({
  object,
  proximityAction,
}: ObjectProximityActionProps) => {
  const lastProximityAction = useRef<
    ObjectProximityActionProps['proximityAction']
  >(null!);

  // handle
  useEffect(() => {
    if (equal(lastProximityAction.current, proximityAction)) return;

    lastProximityAction.current =
      typeof proximityAction === 'boolean'
        ? proximityAction
        : {...proximityAction};

    const proximityAciton =
      typeof proximityAction === 'boolean' ? {} : proximityAction;

    object._setProximityAction(proximityAciton);
  }, [object, proximityAction]);

  // unload
  useEffect(() => {
    return () => {
      lastProximityAction.current = null!;
      object._removeProximityAction();
    };
  }, [object]);

  return null;
};
