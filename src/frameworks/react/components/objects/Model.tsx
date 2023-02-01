import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';
import {useParent} from './Group';

type ModelProps = {
  type: string;
  props?: CreateObjectProps<'model'>;
};

const Model = forwardRef<ObjectManager, ModelProps>((props, ref) => {
  const objects = useObjects();
  const parent = useParent();

  useEffect(() => {
    if (parent?.destroyed === true) return;

    const object = objects.createModel(props.type, {
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

Model.displayName = 'Model';

export default Model;