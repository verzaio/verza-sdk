import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

export const usePersistentStore = <T = any>(name: string, scope?: string) => {
  return useEngine().storage.getPersistentStore<T>(name, scope);
};
