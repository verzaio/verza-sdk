import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type ConeProps = ComponentObjectProps<'cone'>;

export const Cone = forwardRef<ObjectManager, ConeProps>((props, ref) => {
  return <ObjectRender type="cone" props={props} objectRef={ref} />;
});

Cone.displayName = 'Cone';
