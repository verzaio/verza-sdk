import {useEffect, useState} from 'react';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {PickEntity} from 'engine/definitions/types/entities.types';
import EntityManager from 'engine/managers/entities/entity/entity.manager';
import useEntity from './useEntity';

const useStreamedEntity = <
  T extends keyof typeof EntityType,
  H extends InstanceType<PickEntity<T>['EntityManager']> = InstanceType<
    PickEntity<T>['EntityManager']
  >,
>(
  entityId: string | number,
  type: T,
) => {
  const entityManager = useEntity(entityId, type) as EntityManager;

  const [entity, setEntity] = useState<H | null>(() => {
    return entityManager?.streamed ? (entityManager as H) : null;
  });

  // handle socket
  useEffect(() => {
    if (!entityManager) return;

    // check after render
    if (entityManager?.streamed) {
      setEntity(entityManager as H);
    }

    const onStreamIn = entityManager.events.on('onStreamIn', () => {
      setEntity(entityManager as H);
    });

    const onStreamOut = entityManager.events.on('onStreamOut', () => {
      setEntity(null);
    });

    return () => {
      entityManager.events.off('onStreamIn', onStreamIn);
      entityManager.events.off('onStreamOut', onStreamOut);
    };
  }, [entityManager]);

  return entity;
};

export default useStreamedEntity;
