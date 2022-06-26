import { hasOwn, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import { addInstanceListener, getInstanceEvents, getInstancetEventListeners, onceInstanceListener, removeInstanceListener } from "@crush/renderer";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'
import { nextTick } from "@crush/scheduler";

const protoMethods = {
    ...cssMethods
}



const scopeProperties: any = {
    $instance: (instance: any) => instance,
    $el: (instance: any) => instance.vnode,
    $root: (instance: any) => instance.root,
    $attrs: (instance: any) => instance.attrs,
    $slots: (instance: any) => instance.slots,
    $props: (instance: any) => instance.props,
    $parent: (instance: any) => instance.parent,
    $watch: (instance: any) => instance.watch,
    $nextTick: (instance: any) => nextTick.bind(instance.scope),
    $self: (instance: any) => instance.scope,
    // evnets
    $emit: (instance: any) => instance.emit, // init component instance
    $on: (instance: any) => (event: string, handler: any) => addInstanceListener(instance, event, handler),
    $off: (instance: any) => (event: string, handler: any) => removeInstanceListener(instance, event, handler),
    $once: (instance: any) => (event: string, handler: any) => onceInstanceListener(instance, event, handler),
    $events: (instance: any) => getInstanceEvents(instance),
    $listeners: (instance: any) => (event: string) => getInstancetEventListeners(instance, event)
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