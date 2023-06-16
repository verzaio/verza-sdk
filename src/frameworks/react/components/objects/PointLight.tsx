import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type PointLightProps = ComponentObjectProps<'pointlight'>;

export const PointLight = forwardRef<ObjectManager, PointLightProps>(
  (props, ref) => {
    return <ObjectRender type="pointlight" props={props} objectRef={ref} />;
  },
);

PointLight.displayName = 'PointLight';
