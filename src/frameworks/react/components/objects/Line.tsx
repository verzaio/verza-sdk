import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import {Vector3Array} from 'engine/definitions/types/world.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';

type LineProps = {
  points: Vector3Array[];
  color?: string;
  props?: CreateObjectProps<'line'>;
};

const Line = forwardRef<ObjectManager, LineProps>((props, ref) => {
  const objects = useObjects();

  useEffect(() => {
    const object = objects.createLine(props.points, props.color, props.props);

    setReactRef(ref, object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props]);

  return null;
});

Line.displayName = 'Line';

export default Line;
