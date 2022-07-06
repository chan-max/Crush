import { Ref } from "../ref";
declare class ReactiveBoolean extends Ref {
    constructor(value: boolean);
    toggle(): boolean;
    toTrue(): boolean;
    toFalse(): boolean;
}
export declare function useBoolean(value?: boolean): ReactiveBoolean;
export {};
