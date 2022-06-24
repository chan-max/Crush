import { typeOf } from "@crush/common"



export const enum ReactiveFlags {
    RAW = 'raw',
    IS_REACTIVE = 'isReactive',
    IS_SHALLOW = 'isShallow',
    IS_READONLY = 'isReadonly',
    IS_REF = 'isRef',
    IS_COMPUTED = 'isComputed',
    IS_EFFECT = 'isEffect'
}

export const ReactiveTypeSymbol = Symbol('ReactiveType')

// 可被代理的类型 ， 响应式或只读
export function isProxyType(value: any) {
    switch (typeOf(value)) {
        case ReactiveTypes.ARRAY:
        case ReactiveTypes.OBJECT:
        case ReactiveTypes.MAP:
        case ReactiveTypes.SET:
        case ReactiveTypes.WEAK_MAP:
        case ReactiveTypes.WEAK_SET:
            return true
        default:
            return false
    }
}

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