import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import {ObjectBoxDto} from 'types/Dto';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';

type BoxProps = {
  box: ObjectBoxDto;
  props?: CreateObjectProps<'box'>;
};

const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  const objects = useObjects();

  useEffect(() => {
    const object = objects.createBox(props.box, props.props);

    setReactRef(ref, object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props]);

  return null;
});

Box.displayName = 'Box';

export default Box;
