import {ObjectType as ObjectTypeEnum} from '../../enums/objects.enums';
import {CreateEntityProps} from '../entities.types';
import {Vector3Array} from '../world.types';
import {ObjectBaseType} from './objects-definition.types';

export type ObjectBoundingBox = {
  min: Vector3Array;
  max: Vector3Array;
};

export type ObjectEditMode = 'position' | 'rotation' | 'scale';

export type ObjectEditActionType =
  | 'select'
  | 'unselect'
  | 'start'
  | 'update'
  | 'end';

export type ObjectEditAxes = Partial<{
  showX: boolean;
  showY: boolean;
  showZ: boolean;

  showRX: boolean;
  showRY: boolean;
  showRZ: boolean;

  showSX: boolean;
  showSY: boolean;
  showSZ: boolean;
}>;

export type ObjectType = Lowercase<keyof typeof ObjectTypeEnum>;

export type ObjectDataProps = CreateEntityProps & ObjectBaseType;
