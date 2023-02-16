import { SizeProps } from '../definitions/types/scripts.types';
import ControllerManager from './controller.manager';
import EngineManager from './engine.manager';
declare class UIManager {
    visible: boolean;
    private _engine;
    controller: ControllerManager<{
        interfaces: Set<string>;
        cursorLock: boolean;
    }>;
    get interfaces(): Set<string>;
    get cursorLock(): boolean;
    get isActiveInput(): boolean;
    get activeInput(): HTMLInputElement | null;
    private get _messenger();
    constructor(engine: EngineManager);
    bind(): void;
    private _onEscapeKey;
    addInterface(tag: string): void;
    removeInterface(tag: string): void;
    hasInterface(tag: string): boolean;
    isOptionsMenu(): boolean;
    setSize(props: SizeProps): void;
    show(): void;
    hide(): void;
    destroy(): void;
}
export default UIManager;
