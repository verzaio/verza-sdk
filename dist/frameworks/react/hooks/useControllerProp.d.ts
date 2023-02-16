import ControllerManager from '../../../managers/controller.manager';
export declare const useControllerProp: <T extends ControllerManager<{
    [name: string]: unknown;
}>, V extends keyof T["data"]>(controller: T, name: V) => T["data"][V];
