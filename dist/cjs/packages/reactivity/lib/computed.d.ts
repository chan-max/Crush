import { ReactiveFlags, ReactiveTypeSymbol } from "./common";
export declare const computed: (getter: any) => ComputedRef;
export declare class ComputedRef {
    [ReactiveTypeSymbol]: boolean;
    [ReactiveFlags.IS_COMPUTED]: boolean;
    [ReactiveFlags.IS_REF]: boolean;
    cacheValue: any;
    oldValue: any;
    shouldCompute: boolean;
    computedEffect: any;
    constructor(getter: any);
    get computedValue(): any;
    get value(): any;
}
