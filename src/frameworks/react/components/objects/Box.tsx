import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import {ObjectBoxType} from 'engine/definitions/types/objects/objects-definition.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

type BoxProps = CreateObjectProps<'box'> & {
  box: ObjectBoxType['o'];
};

export const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  const objects = useObjects();
  const {setObject, objectProps, parent} = useObjectCreator();

  useEffect(() => {
    const object = objects.createBox(props.box, {
      ...props,

      ...objectProps(props.id),
    });

    setObject(object, ref);
  }, [setObject, objectProps, objects, props, parent]);

  //
  return null;
});

Box.displayName = 'Box';
