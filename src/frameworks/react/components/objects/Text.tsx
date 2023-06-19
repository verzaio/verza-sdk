import React, {forwardRef, useMemo} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type TextProps = Omit<ComponentObjectProps<'text'>, 'text'> & {
  text?: string;
  children?: string;
};

export const Text = forwardRef<ObjectManager, TextProps>(
  ({children, ...props}, ref) => {
    const allProps = useMemo(() => {
      return {
        ...props,
        text: props.text ?? children ?? 'No Text',
      };
    }, [children, props]);

    return <ObjectRender type="text" props={allProps} objectRef={ref} />;
  },
);

Text.displayName = 'Text';
