import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import {Vector3Array} from 'engine/definitions/types/world.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';
import {useParent} from './Group';

type LineProps = {
  points: Vector3Array[];
  color?: string;
  props?: CreateObjectProps<'line'>;
};

export const Line = forwardRef<ObjectManager, LineProps>((props, ref) => {
  const objects = useObjects();
  const parent = useParent();

  useEffect(() => {
    if (parent?.destroyed === true) return;

    const object = objects.createLine(props.points, props.color, {
      parentId: parent?.id,
      ...props.props,
    });

    setReactRef(ref, object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props, parent]);

  return null;
});

Line.displayName = 'Line';

export default Line;
