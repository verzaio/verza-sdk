/// <reference types="react" />
import { CreateObjectProps } from '../../../../definitions/types/objects.types';
import { Vector3Array } from '../../../../definitions/types/world.types';
import ObjectManager from '../../../../managers/entities/objects/object/object.manager';
type LineProps = {
    points: Vector3Array[];
    color?: string;
    props?: CreateObjectProps<'line'>;
};
export declare const Line: import("react").ForwardRefExoticComponent<LineProps & import("react").RefAttributes<ObjectManager>>;
export default Line;
