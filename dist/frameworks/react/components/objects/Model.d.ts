/// <reference types="react" />
import { CreateObjectProps } from '../../../../definitions/types/objects.types';
import ObjectManager from '../../../../managers/entities/objects/object/object.manager';
type ModelProps = {
    type: string;
    props?: CreateObjectProps<'model'>;
};
export declare const Model: import("react").ForwardRefExoticComponent<ModelProps & import("react").RefAttributes<ObjectManager>>;
export {};
