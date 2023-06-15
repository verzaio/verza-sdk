import {useEngine} from 'engine/framework-react';

export const useMemoryStore = <T = any>(name: string, scope?: string) => {
  return useEngine().storage.getMemoryStore<T>(name, scope);
};
