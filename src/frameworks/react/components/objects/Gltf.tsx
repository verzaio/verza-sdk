import {forwardRef, useMemo} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type GltfProps = Omit<ComponentObjectProps<'gltf'>, 'u'> & {
  url: string;
  u?: string;
};

export const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  useObjectCreator(
    'gltf',
    useMemo(() => {
      const {url, u, ...allProps} = props;

      return {
        u: u ?? url,
        ...allProps,
      };
    }, [props]),
    ref,
  );

  return null;
});

Gltf.displayName = 'Gltf';
