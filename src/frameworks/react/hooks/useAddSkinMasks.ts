import {useMemo, useRef} from 'react';

import deepEqual from 'deep-equal';

import {SkinMaskItem} from 'engine/definitions/types/clothes.types';
import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

const useAddSkinMasks = (masks: SkinMaskItem[]) => {
  const {clothes} = useEngine();

  const itemsRef = useRef(masks);

  const isEqual = deepEqual(masks, itemsRef.current);

  itemsRef.current = masks;

  useMemo(
    () => itemsRef.current.forEach(item => clothes.addSkinMask(item)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEqual],
  );
};

export {useAddSkinMasks};
