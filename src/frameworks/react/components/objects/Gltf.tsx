import React, {forwardRef, useMemo} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type GltfProps = Omit<ComponentObjectProps<'gltf'>, 'u'> & {
  url: string;
  u?: string;
};

export const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  const allProps = useMemo(() => {
    const {url, u, ...allProps} = props;

    return {
      u: u ?? url,
      ...allProps,
    };
  }, [props]);

  return <ObjectRender type="gltf" props={allProps} objectRef={ref} />;
});

Gltf.displayName = 'Gltf';
