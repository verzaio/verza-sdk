/// <reference types="react" />
import { CreateObjectProps } from '../../../../definitions/types/objects.types';
import { ObjectBoxDto } from '../../../../generated/dtos.types';
import ObjectManager from '../../../../managers/entities/objects/object/object.manager';
type BoxProps = {
    box: ObjectBoxDto;
    props?: CreateObjectProps<'box'>;
};
export declare const Box: import("react").ForwardRefExoticComponent<BoxProps & import("react").RefAttributes<ObjectManager>>;
export {};
