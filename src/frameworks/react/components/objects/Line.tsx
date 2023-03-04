import {forwardRef, useEffect} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import {Vector3Array} from 'engine/definitions/types/world.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {useObjectCreator} from './Group';

type LineProps = CreateObjectProps<'line'> & {
  points: Vector3Array[];
  color?: string;
};

export const Line = forwardRef<ObjectManager, LineProps>((props, ref) => {
  const objects = useObjects();

  const {setObject, objectProps} = useObjectCreator();

  useEffect(() => {
    const object = objects.createLine(props.points, props.color, {
      ...props,

      ...objectProps(props?.id),
    });

    setObject(object, ref);
  }, [setObject, objectProps, objects, props]);

  return null;
});

Line.displayName = 'Line';

export default Line;
