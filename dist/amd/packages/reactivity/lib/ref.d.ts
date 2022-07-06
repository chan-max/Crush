import { ReactiveFlags, ReactiveTypeSymbol } from "./common";
export declare const ref: (value: any, options?: any) => Ref;
export declare const createRefValueSetter: (ref: Ref) => (newValue: any) => any;
export declare class Ref {
    [ReactiveTypeSymbol]: boolean;
    [ReactiveFlags.IS_REF]: boolean;
    oldValue: any;
    _value: any;
    sensitive: any;
    constructor(value: any, options?: any);
    get value(): any;
    set value(newValue: any);
}
export declare const getRefDeps: (ref: any) => Set<any>;
export declare function trackRef(ref: any): void;
export declare function triggerRef(ref: any): void;
export declare const cleaarRefDeps: (ref: Ref) => void;
