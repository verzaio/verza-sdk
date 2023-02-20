import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import {ObjectBoxDto} from 'engine/generated/dtos.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';
import {useParent} from './Group';

type BoxProps = CreateObjectProps<'box'> & {
  box: ObjectBoxDto;
};

export const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  const objects = useObjects();
  const parent = useParent();

  useEffect(() => {
    if (parent?.destroyed === true) return;

    const object = objects.createBox(props.box, {
      parentId: parent?.id,
      ...props,
    });

    setReactRef(ref, object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props, parent]);

  return null;
});

Box.displayName = 'Box';
