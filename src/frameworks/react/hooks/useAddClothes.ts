import {useMemo, useRef} from 'react';

import {deepEqual} from 'fast-equals';

import {ClotheItem} from 'engine/definitions/types/clothes.types';
import {useEngine} from 'engine/framework-react';

const useAddClothes = (clotheItems: ClotheItem[]) => {
  const {clothes} = useEngine();

  const itemsRef = useRef(clotheItems);

  const isEqual = deepEqual(clotheItems, itemsRef.current);

  itemsRef.current = clotheItems;

  useMemo(
    () => itemsRef.current.forEach(item => clothes.addClothe(item)),
    [isEqual],
  );
};

export {useAddClothes};
