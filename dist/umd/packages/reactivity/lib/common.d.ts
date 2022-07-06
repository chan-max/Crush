export declare const enum ReactiveFlags {
    RAW = "raw",
    IS_REACTIVE = "isReactive",
    IS_SHALLOW = "isShallow",
    IS_READONLY = "isReadonly",
    IS_REF = "isRef",
    IS_COMPUTED = "isComputed",
    IS_EFFECT = "isEffect"
}
export declare const ReactiveTypeSymbol: unique symbol;
export declare function isProxy(value: any): any;
export declare function isProxyType(value: any): boolean;
export declare function markRaw(data: any): any;
export declare enum ReactiveTypes {
    OBJECT = "Object",
    ARRAY = "Array",
    MAP = "Map",
    SET = "Set",
    WEAK_MAP = "WeakMap",
    WEAK_SET = "WeakSet"
}
export declare function toRaw(value: any): any;
export declare function isReactive(value: any): any;
export declare function isShallow(value: any): any;
export declare function isRef(value: any): any;
