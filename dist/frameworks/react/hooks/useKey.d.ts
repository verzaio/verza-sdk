import { KeyInfo } from '../../../definitions/types/ui.types';
type UseKeyOptions = {
    event?: 'keydown' | 'keyup';
    ignoreFlags?: boolean;
    ignoreControls?: boolean;
    ignoreActiveInput?: boolean;
    ignoreOptionsMenu?: boolean;
};
export declare const useKey: (key: string | string[], callback: (event: KeyInfo) => void, options?: UseKeyOptions) => void;
export {};
