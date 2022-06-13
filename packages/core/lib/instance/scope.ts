import { hasOwn, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'

const protoMethods = {
    ...cssMethods
}


const scopeProperties: any = {
    $instance: (instance: any) => instance,
    $emit: (instance: any) => instance.emit,
    $el: (instance: any) => instance.vnode
}

export function defineScopePropertyGetter(key: string, getter: any) {
    scopeProperties[key] = getter
}

export function createScope(instance: any) {
    const scope = reactive(Object.create(protoMethods))

    for (let key in scopeProperties) {
        Reflect.defineProperty(scope, key, {
            configurable: false,
            enumerable: false,
            get: () => scopeProperties[key](instance)
        })
    }

    return new Proxy(scope, {
        get(target: any, key: any, receiver: any) {
            if (key === Symbol.unscopables) {
                return
            }
            var result = Reflect.get(target, key, receiver)
            return isRef(result) ? result.value : result
        },
        set(target: any, key: any, newValue: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                return true
            } else {
                return Reflect.set(target, key, newValue, receiver)
            }
        }
    })
}