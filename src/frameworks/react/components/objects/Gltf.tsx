import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';
import {useParent} from './Group';

type GltfProps = {
  url: string;
  props?: CreateObjectProps<'gltf'>;
};

const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  const objects = useObjects();
  const parent = useParent();

  useEffect(() => {
    if (parent?.destroyed === true) return;

    const object = objects.createGltf(props.url, {
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

Gltf.displayName = 'Gltf';

export default Gltf;
