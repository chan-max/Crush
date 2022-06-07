


export const enum ReactiveFlags {
    RAW = 'raw',
    IS_REACTIVE = 'isReactive',
    IS_SHALLOW = 'isShallow',
    IS_READONLY = 'isReadonly',
    IS_REF = 'isRef',
    IS_COMPUTED = 'isComputed'
}


export enum ReactiveTypes {
    OBJECT = 'Object',
    ARRAY = 'Array',
    MAP = 'Map',
    SET = 'Set',
    WEAK_MAP = 'WeakMap',
    WEAK_SET = 'WeakSet',
}

export function toRaw(reactiveData: any) {
    return reactiveData[ReactiveFlags.RAW]
}

export function isReactive(value: any) {
    return value[ReactiveFlags.IS_REACTIVE]
}

export function isShallow(value: any) {
    return value[ReactiveFlags.IS_SHALLOW]
}

export function isRef(value: any) {
    return value[ReactiveFlags.IS_REF]
}