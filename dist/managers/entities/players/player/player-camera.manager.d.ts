import { CameraModeType, CameraPosition, CameraTransition } from '../../../../definitions/types/camera.types';
import PlayerManager from './player.manager';
declare class PlayerCameraManager {
    private _player;
    private get _messenger();
    constructor(player: PlayerManager);
    private _normalizePosition;
    setMode(mode: CameraModeType, instant?: boolean): void;
    setTransitions(transitions: CameraTransition[]): void;
    setTransition(transition: CameraTransition): void;
    setPosition(transition: CameraPosition): void;
}
export default PlayerCameraManager;
