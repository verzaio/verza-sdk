import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

export type ModelProps = CreateObjectProps<'model'>;

export const Model = forwardRef<ObjectManager, ModelProps>((props, ref) => {
  const objects = useObjects();

  const {setObject, objectProps} = useObjectCreator();

  useEffect(() => {
    const object = objects.create('model', {
      ...props,
      ...objectProps(props?.id),
    });

    setObject(object, ref);
  }, [setObject, objectProps, objects, props]);

  return null;
});

Model.displayName = 'Model';
