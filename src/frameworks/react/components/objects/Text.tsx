import {forwardRef, useMemo} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type TextProps = Omit<ComponentObjectProps<'text'>, 'text'> & {
  text?: string;
  children?: string;
};

export const Text = forwardRef<ObjectManager, TextProps>(
  ({children, ...props}, ref) => {
    useObjectCreator(
      'text',
      useMemo(() => {
        return {
          ...props,
          text: props.text ?? children ?? 'No Text',
        };
      }, [children, props]),
      ref,
    );

    return null;
  },
);

Text.displayName = 'Box';
