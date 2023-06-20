import {useEngine} from 'engine/framework-react';

import {useSuspend} from './useSuspend';

const useAddAnimations = (url: string) => {
  const {animations} = useEngine();

  return useSuspend(() => animations.addAnimations(url), [url]);
};

export {useAddAnimations};
