import {createContext, useContext} from 'react';

import {ObjectManager} from 'engine/types';

export const ParentContext = createContext<ObjectManager>(null!);

const useObjectParent = () => {
  return useContext(ParentContext);
};

export default useObjectParent;
