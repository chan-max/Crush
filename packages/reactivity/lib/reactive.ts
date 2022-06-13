import { typeOf } from "@crush/common";
import { isProxy, ReactiveTypes } from "./common";
import {
    reactiveCollectionHandler,
    reactiveHandler,
    readonlyCollectionHandler,
    readonlyHandler,
    shallowReactiveCollectionHandler,
    shallowReactiveHandler,
    shallowReadonlyCollectionHandler,
    shallowReadonlyHandler
} from "./handler";


export const createReactiveObject = (value: any) => new Proxy(value, reactiveHandler)
export const createReadonlyObject = (value: any) => new Proxy(value, readonlyHandler)
export const createShallowReactiveObject = (value: any) => new Proxy(value, shallowReactiveHandler)
export const createShallowReadonlyObject = (value: any) => new Proxy(value, shallowReadonlyHandler)

export const createReactiveCollection = (value: any) => new Proxy(value, reactiveCollectionHandler)
export const createReadonlyCollection = (value: any) => new Proxy(value, readonlyCollectionHandler)
export const createShallowReactiveCollection = (value: any) => new Proxy(value, shallowReactiveCollectionHandler)
export const createShallowReadonlyCollection = (value: any) => new Proxy(value, shallowReadonlyCollectionHandler)


function createProxy(value: any, isReadonly: boolean, isShallow: boolean): any {
    //! 如果 已经代理过，返回原始值
    if (isProxy(value)) {
        return value
    }
    switch (typeOf(value)) {
        case ReactiveTypes.OBJECT:
        case ReactiveTypes.ARRAY:
            return isReadonly ?
                (isShallow ? createShallowReadonlyObject(value) : createReadonlyObject(value)) :
                (isShallow ? createShallowReactiveObject(value) : createReactiveObject(value))
        case ReactiveTypes.MAP:
        case ReactiveTypes.WEAK_MAP:
        case ReactiveTypes.SET:
        case ReactiveTypes.WEAK_SET:
            return isReadonly ?
                (isShallow ? createShallowReadonlyCollection(value) : createReadonlyCollection(value)) :
                (isShallow ? createShallowReactiveCollection(value) : createReactiveCollection(value))
        default:
            return value
    }
}

export function reactive(value: any) {
    return createProxy(value, false, false)
}

export function shallowReactive(value: any) {
    return createProxy(value, false, true)
}

export function readonly(value: any) {
    return createProxy(value, true, false)
}

export function shallowReadonly(value: any) {
    return createProxy(value, true, true)
}