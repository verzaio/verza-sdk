import {useMemo} from 'react';

import {EntityType} from 'engine/definitions/enums/entities.enums';
import {PickEntity} from 'engine/definitions/types/entities.types';
import {useEngine} from './useEngine';

export const useEntity = <T extends keyof typeof EntityType>(
  id: string | number,
  type: T,
) => {
  const entities = useEngine().entities[type];

  return useMemo(() => {
    return entities?.get(id);
  }, [entities, id]) as unknown as InstanceType<PickEntity<T>['EntityManager']>;
};
