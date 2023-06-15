import {useEngine} from 'engine/framework-react';

export const usePersistentStore = <T = any>(name: string, scope?: string) => {
  return useEngine().storage.getPersistentStore<T>(name, scope);
};
