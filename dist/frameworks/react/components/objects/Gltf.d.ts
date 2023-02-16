/// <reference types="react" />
import { CreateObjectProps } from '../../../../definitions/types/objects.types';
import ObjectManager from '../../../../managers/entities/objects/object/object.manager';
type GltfProps = {
    url: string;
    props?: CreateObjectProps<'gltf'>;
};
export declare const Gltf: import("react").ForwardRefExoticComponent<GltfProps & import("react").RefAttributes<ObjectManager>>;
export {};
