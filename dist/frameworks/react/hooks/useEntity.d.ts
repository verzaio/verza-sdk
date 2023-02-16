import { PickEntity } from '../../../definitions/types/entities.types';
export declare const useEntity: <T extends "object" | "player">(id: string | number, type: T) => InstanceType<PickEntity<T>["EntityManager"]>;
