import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import {ObjectBoxDto} from 'engine/generated/dtos.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';
import {useParent} from './Group';

type BoxProps = {
  box: ObjectBoxDto;
  props?: CreateObjectProps<'box'>;
};

const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  const objects = useObjects();
  const parent = useParent();

  useEffect(() => {
    if (parent?.destroyed === true) return;

    const object = objects.createBox(props.box, {
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

Box.displayName = 'Box';

export default Box;
