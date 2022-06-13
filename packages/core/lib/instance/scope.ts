import { hasOwn, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'

const protoMethods = {
    ...cssMethods
}


const scopeProperties: any = {
    $instance: (instance: any) => instance
}

export function defineScopeGetterProperty(key: string, getter: any) {
    scopeProperties[key] = getter
}

export function createScope(instance: any) {
    return new Proxy(reactive(Object.create(protoMethods)), {
        get(target: any, key: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                return scopeProperties[key](instance)
            }
            var result = Reflect.get(target, key, receiver)

            return isRef(result) ? result.value : result
        },
        set(target: any, key: any, newValue: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                warn('proto methods cant redefine')
                return true
            } else {
                return Reflect.set(target, key, newValue, receiver)
            }
        }
    })
}