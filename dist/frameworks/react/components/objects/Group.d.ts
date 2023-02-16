import React, { ReactNode } from 'react';
import { CreateObjectProps } from '../../../../definitions/types/objects.types';
import ObjectManager from '../../../../managers/entities/objects/object/object.manager';
type GroupProps = {
    children?: ReactNode;
    props?: CreateObjectProps<'group'>;
};
export declare const Group: React.ForwardRefExoticComponent<GroupProps & React.RefAttributes<ObjectManager>>;
export declare const useParent: () => ObjectManager;
export {};
