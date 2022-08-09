import { doKeyframesAnimation } from "@crush/animate";
import { hasOwn, isPromise, uid, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import { addInstanceListener, createInstanceEventEmitter, getInstanceEvents, getInstancetEventListeners, onceInstanceListener, removeInstanceListener } from "@crush/renderer";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'
import { querySelector, querySelectorAll } from "@crush/renderer/lib/common/querySelector";
import { nextTick } from "@crush/scheduler";
import { ComponentInstance } from "./componentInstance";
import { getEL } from '@crush/renderer'
import { cacheDebounce, cacheThrottle, debounce, throttle } from "@crush/common";

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
        let el = vnode.map((_vnode: any) => getEL(_vnode))
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

    // 查询当前组件内的元素 , 组件的话返回组件实例
    $querySelector: (instance: any) => (selector: any) => {
        // 先当做组件选择器，如果不是定义的组件则当做普通元素
        let type = instance?.components[selector] || selector
        return querySelector(type, instance.vnode)
    },
    $querySelectorAll: (instance: any) => (selector: any) => {
        // 先当做组件选择器，如果不是定义的组件则当做普通元素
        let type = instance?.components[selector] || selector
        return querySelectorAll(type, instance.vnode)
    },
}


export const defineScopeProperty = (key: string, getter: any) => scopeProperties[key] = getter

const protoMethods = {
    debounce,
    throttle,
    ...cssMethods,
    ...scopeProperties, // todo bug (with)
}


// inject scope property
export function createScope(instance: any) {
    const scope = reactive(Object.create(protoMethods))
    return new Proxy(scope, {
        get(target: any, key: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                // 实例方法
                return scopeProperties[key](instance)
            }
            return Reflect.get(target, key, receiver)
        },
        set(target: any, key: any, newValue: any, receiver: any) {
            if (hasOwn(scopeProperties, key)) {
                // 实例方法不能设置
                return true
            }

            // 挂载到作用于上的promise异步数据会被自动请求
            if (isPromise(newValue)) {
                // 先设置一个默认值,不然会出现bug
                Reflect.set(target, key, null, receiver)
                newValue.then((result: any) => {
                    return Reflect.set(target, key, result, receiver)
                })
            } else {
                return Reflect.set(target, key, newValue, receiver)
            }

            return true
        }
    })
}

// 这些方法只能提供给模板使用
const specialTemplateMethods: any = {
    // 模板会编译成 () => debounce(...) 所以函数会直接调用
    debounce(fn: any, wait: number) {
        return cacheDebounce(fn, wait)()
    },
    throttle(fn: any, wait: number) {
        return cacheThrottle(fn, wait)()
    },
}

export function createRenderScope(instanceScope: any) {
    return new Proxy(instanceScope, {
        get(target: any, key: any, receiver: any) {
            if (key === Symbol.unscopables) {
                return
            }

            if (hasOwn(specialTemplateMethods, key)) {
                return specialTemplateMethods[key]
            }

            // todo magic variables
            var result = Reflect.get(target, key, receiver)
            return isRef(result) ? result.value : result
        }
    })
}

