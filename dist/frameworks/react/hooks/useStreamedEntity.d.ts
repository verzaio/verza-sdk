import { PickEntity } from '../../../definitions/types/entities.types';
export declare const useStreamedEntity: <T extends "object" | "player", H extends InstanceType<PickEntity<T>["EntityManager"]> = InstanceType<PickEntity<T>["EntityManager"]>>(entityId: string | number, type: T) => H | null;
