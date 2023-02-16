import { PerspectiveCamera } from 'three';
import EngineManager from './engine.manager';
declare class CameraManager {
    private _engine;
    private get _messenger();
    camera: PerspectiveCamera;
    get position(): import("three").Vector3;
    get rotation(): import("three").Euler;
    get quaternion(): import("three").Quaternion;
    constructor(engine: EngineManager);
    bind(): void;
}
export default CameraManager;
