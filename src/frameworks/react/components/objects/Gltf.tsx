import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

type GltfProps = CreateObjectProps<'gltf'> & {
  url: string;
};

export const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  const objects = useObjects();
  const {setObject, objectProps} = useObjectCreator();

  useEffect(() => {
    const object = objects.createGltf(props.url, {
      ...props,

      ...objectProps(props.id),
    });

    setObject(object, ref);
  }, [setObject, objectProps, objects, props]);

  return null;
});

Gltf.displayName = 'Gltf';
