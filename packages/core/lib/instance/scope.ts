import { hasOwn, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'
import { nextTick } from "@crush/scheduler";

const protoMethods = {
    ...cssMethods
}



const scopeProperties: any = {
    $instance: (instance: any) => instance,
    $emit: (instance: any) => instance.emit,
    $el: (instance: any) => instance.vnode,
    $root: (instance: any) => instance.root,
    $attrs: (instance: any) => instance.attrs,
    $slots: (instance: any) => instance.slots,
    $parent: (instance: any) => instance.parent,
    $watch: (instance: any) => instance.watch,
    $nextTick: (instance: any) => nextTick.bind(instance.scope),
    $animate: () => ''
}

export function defineScopePropertyGetter(key: string, getter: any) {
    scopeProperties[key] = getter
}

export function createScope(instance: any) {
    const scope = reactive(Object.create(protoMethods))

    return new Proxy(scope, {
        get(target: any, key: any, receiver: any) {
            if (key === Symbol.unscopables) {
                return
            }
            if (hasOwn(scopeProperties, key)) {
                return scopeProperties[key](instance)
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