import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

export type TextProps = Omit<CreateObjectProps<'text'>, 'text'> & {
  text?: string;
  children?: string;
};

export const Text = forwardRef<ObjectManager<'text'>, TextProps>(
  ({children, ...props}, ref) => {
    const objects = useObjects();
    const {setObject, objectProps, parent} = useObjectCreator();

    useEffect(() => {
      const object = objects.create('text', {
        ...props,
        ...objectProps(props.id),

        text: props.text ?? children ?? 'No Text',
      });

      setObject(object, ref);
    }, [setObject, objectProps, objects, props, children, parent]);

    return null;
  },
);

Text.displayName = 'Box';
