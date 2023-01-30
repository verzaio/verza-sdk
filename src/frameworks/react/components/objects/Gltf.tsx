import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {forwardRef, useEffect} from 'react';
import useObjects from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';

type GltfProps = {
  url: string;
  props?: CreateObjectProps<'gltf'>;
};

const Gltf = forwardRef<ObjectManager, GltfProps>((props, ref) => {
  const objects = useObjects();

  useEffect(() => {
    const object = objects.createGltf(props.url, props.props);

    setReactRef(ref, object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props]);

  return null;
});

Gltf.displayName = 'Line';

export default Gltf;
