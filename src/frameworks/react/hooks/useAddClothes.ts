import {useEngine} from 'engine/framework-react';
import {ClotheItem} from 'engine/types';

import {useSuspend} from './useSuspend';

const useAddClothes = (clotheItems: ClotheItem[]) => {
  const {clothes} = useEngine();

  useSuspend(
    () => Promise.all(clotheItems.map(clothe => clothes.addClothe(clothe))),
    [clotheItems],
  );
};

export {useAddClothes};
