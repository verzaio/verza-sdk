import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type RectAreaLightProps = ComponentObjectProps<'rectarealight'>;

export const RectAreaLight = forwardRef<ObjectManager, RectAreaLightProps>(
  (props, ref) => {
    return <ObjectRender type="rectarealight" props={props} objectRef={ref} />;
  },
);

RectAreaLight.displayName = 'PointLight';
