


export const enum ReactiveFlags {
    RAW = 'raw',
    IS_REACTIVE = 'isReactive',
    IS_SHALLOW = 'isShallow',
    IS_READONLY = 'isReadonly',
    IS_REF = 'isRef',
    IS_COMPUTED = 'isComputed'
}

export const ReactiveTypeSymbol = Symbol('ReactiveType')


export enum ReactiveTypes {
    OBJECT = 'Object',
    ARRAY = 'Array',
    MAP = 'Map',
    SET = 'Set',
    WEAK_MAP = 'WeakMap',
    WEAK_SET = 'WeakSet',
}

export function toRaw(value: any) {
    return value && value[ReactiveFlags.RAW]
}

export function isReactive(value: any) {
    return value && value[ReactiveFlags.IS_REACTIVE]
}

export function isShallow(value: any) {
    return value && value[ReactiveFlags.IS_SHALLOW]
}

export function isRef(value: any) {
    return value && value[ReactiveFlags.IS_REF]
}

export function isProxy(value: any) {
    return value && value[ReactiveTypeSymbol]
}