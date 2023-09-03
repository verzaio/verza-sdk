import {useMemo, useRef} from 'react';

import {deepEqual} from 'assert';

import {useEngine} from 'engine/framework-react';
import {SkinMaskItem} from 'engine/types';

const useAddSkinMasks = (masks: SkinMaskItem[]) => {
  const {clothes} = useEngine();

  const itemsRef = useRef(masks);

  const isEqual = deepEqual(masks, itemsRef.current);

  itemsRef.current = masks;

  useMemo(
    () => itemsRef.current.forEach(item => clothes.addSkinMask(item)),
    [isEqual],
  );
};

export {useAddSkinMasks};
