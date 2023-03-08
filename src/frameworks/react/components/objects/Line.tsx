import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type LineProps = ComponentObjectProps<'line'>;

export const Line = forwardRef<ObjectManager, LineProps>((props, ref) => {
  useObjectCreator('line', props, ref);

  return null;
});

Line.displayName = 'Line';

export default Line;
