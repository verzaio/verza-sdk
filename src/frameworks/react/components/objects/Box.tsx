import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

export type BoxProps = CreateObjectProps<'box'>;

export const Box = forwardRef<ObjectManager<'box'>, BoxProps>(
  ({...props}, ref) => {
    const objects = useObjects();
    const {setObject, objectProps, parent} = useObjectCreator();

    useEffect(() => {
      const object = objects.create('box', {
        ...props,
        ...objectProps(props.id),
      });

      setObject(object, ref);
    }, [setObject, objectProps, objects, props, parent]);

    return null;
  },
);

Box.displayName = 'Box';
