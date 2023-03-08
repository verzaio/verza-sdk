import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

export type GltfProps = Omit<CreateObjectProps, 'u'> & {
  url: string;
  u?: string;
};

export const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  const objects = useObjects();
  const {setObject, objectProps} = useObjectCreator();

  useEffect(() => {
    const {url, u, ...allProps} = props;
    const object = objects.create('gltf', {
      u: u ?? url,

      ...allProps,

      ...objectProps(allProps.id),
    });

    setObject(object, ref);
  }, [setObject, objectProps, objects, props]);

  return null;
});

Gltf.displayName = 'Gltf';
