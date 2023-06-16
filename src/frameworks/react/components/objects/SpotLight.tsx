import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type SpotLightProps = ComponentObjectProps<'spotlight'>;

export const SpotLight = forwardRef<ObjectManager, SpotLightProps>(
  (props, ref) => {
    return <ObjectRender type="spotlight" props={props} objectRef={ref} />;
  },
);

SpotLight.displayName = 'PointLight';
