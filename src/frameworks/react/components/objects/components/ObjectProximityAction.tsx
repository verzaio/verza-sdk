import {useEffect, useRef} from 'react';

import equal from 'fast-deep-equal';

import {ProximityAction} from 'engine/definitions/types/world.types';
import {ObjectManager} from 'engine/types';

type ObjectProximityActionProps = {
  object: ObjectManager;
  proximityAction: Omit<ProximityAction, 'id' | 'objectId'> | boolean;
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

    object.setProximityAction(proximityAciton);
  }, [object, proximityAction]);

  // unload
  useEffect(() => {
    return () => {
      lastProximityAction.current = null!;
      object.removeProximityAction();
    };
  }, [object]);

  return null;
};
