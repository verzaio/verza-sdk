import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

export const useMemoryStore = <T = any>(name: string, scope?: string) => {
  return useEngine().storage.getMemoryStore<T>(name, scope);
};
