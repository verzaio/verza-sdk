import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type CapsuleProps = ComponentObjectProps<'capsule'>;

export const Capsule = forwardRef<ObjectManager, CapsuleProps>((props, ref) => {
  return <ObjectRender type="capsule" props={props} objectRef={ref} />;
});

Capsule.displayName = 'Capsule';
