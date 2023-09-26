import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

import {useSuspend} from './useSuspend';

const useAddAnimations = (url: string) => {
  const {animations} = useEngine();

  return useSuspend(() => animations.addAnimations(url), [url]);
};

export {useAddAnimations};
