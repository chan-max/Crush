import { doCSSAnimation } from "@crush/animate";
import { hasOwn, uid, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import { addInstanceListener, createInstanceEventEmitter, getInstanceEvents, getInstancetEventListeners, onceInstanceListener, removeInstanceListener } from "@crush/renderer";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'
import { nextTick } from "@crush/scheduler";
import { ComponentInstance } from "./componentInstance";



const scopeProperties: any = {
    $uid: (instance: ComponentInstance) => instance.uid, // 组件级别的唯一id
    $uuid: uid, // 每次访问均返回不同的id
    $instance: (instance: ComponentInstance) => instance,
    $refs: (instance: ComponentInstance) => {
        return instance.refs ||= {} // ! 确保组件没挂载时可以拿到 refs
    },
    $el: (instance: any) => {
        let { vnode, isMounted } = instance
        if (!isMounted || !vnode) {
            return null
        }
        let el = vnode.map((_vnode: any) => _vnode.el)
        // 有多个根元素会返回多个元素
        return el.length === 1 ? el[0] : el
    },
    $root: (instance: any) => instance.root,
    $props: (instance: any) => instance.props ||= {}, // props包括 props， attrs 和 events
    $attrs: (instance: any) => instance.attrs ||= {},
    $slots: (instance: any) => instance.slots,
    $parent: (instance: any) => instance.parent,
    $watch: (instance: any) => instance.watch,
    $nextTick: (instance: any) => nextTick.bind(instance.scope),
    $self: (instance: any) => instance.scope,
    $forceUpdate: (instance: any) => {
        if (!instance.isMounted) {
            return instance.update
        }
    },
    // evnets
    $emit: (instance: any) => instance.emit, // init component instance
    $on: (instance: any) => instance.on,
    $off: (instance: any) => instance.off,
    $once: (instance: any) => instance.once,

    // 执行 keyframes动画 ， 参数与 animation相同 , 与ref配合
    $animate: (instance: ComponentInstance) => {
        return (ref: any, animationOptions: any) => {
            let el = instance.refs[ref]
            if (el) {
                return doCSSAnimation(el, animationOptions)
            }
        }
    }
}

export const defineScopeProperty = (key: string, getter: any) => scopeProperties[key] = getter

const protoMethods = {
    ...cssMethods,
    ...scopeProperties, // todo bug (with)
}


// inject scope property
export function createScope(instance: any) {
    const scope = reactive(Object.create(protoMethods))
    return new Proxy(scope, {
        get(target: any, key: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                return scopeProperties[key](instance)
            }
            return Reflect.get(target, key, receiver)
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



// process ref
export function createRenderScope(instanceScope: any) {
    return new Proxy(instanceScope, {
        get(target: any, key: any, receiver: any) {
            if (key === Symbol.unscopables) {
                return
            }

            // todo magic variables

            var result = Reflect.get(target, key, receiver)
            return isRef(result) ? result.value : result
        }
    })
}