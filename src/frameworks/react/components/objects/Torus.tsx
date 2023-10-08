import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type TorusProps = ComponentObjectProps<'torus'>;

export const Torus = forwardRef<ObjectManager, TorusProps>((props, ref) => {
  return <ObjectRender type="torus" {...props} objectRef={ref} />;
});

Torus.displayName = 'Torus';
