import {useMemo, useRef} from 'react';

import deepEqual from 'deep-equal';

import {ClotheItem} from 'engine/definitions/types/clothes.types';
import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

const useAddClothes = (clotheItems: ClotheItem[]) => {
  const {clothes} = useEngine();

  const itemsRef = useRef(clotheItems);

  const isEqual = deepEqual(clotheItems, itemsRef.current);

  itemsRef.current = clotheItems;

  useMemo(
    () => itemsRef.current.forEach(item => clothes.addClothe(item)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEqual],
  );
};

export {useAddClothes};
