import { doKeyframesAnimation } from "@crush/animate";
import { hasOwn, isPromise, uid, warn } from "@crush/common";
import { isRef, reactive } from "@crush/reactivity";
import { getEdgeElements } from "@crush/renderer";
import cssMethods from '@crush/renderer/lib/builtIn/cssFunctionExport'
import { querySelector, querySelectorAll } from "@crush/renderer/lib/common/querySelector";
import { nextTick } from "@crush/scheduler";

import { cacheDebounce, cacheThrottle, debounce, throttle } from "@crush/common";
import { getCurrentApp } from "../app/app";

import { lighten, darken, saturate, desaturate, opacity } from "@crush/reactivity";

export const scopeProperties: any = {
    _currentPropertyAccessInstance: null, // 保存当前属性访问的组件实例，在那个组件实例中访问的属性
    get $app() {
        return getCurrentApp()
    },
    get $uid() {
        return this._currentPropertyAccessInstance.uid
    }, // 组件级别的唯一id
    get $uuid() {
        return uid()
    }, // 每次访问均返回不同的id
    get $options() {
        return this._currentPropertyAccessInstance.options
    },
    get $instance() {
        return this._currentPropertyAccessInstance
    },
    get $refs() {
        return this._currentPropertyAccessInstance.refs ||= {} // 确保组件没挂载时可以拿到 refs
    },
    get $colors() {
        return getCurrentApp().colors
    },
    get $el() {
        let { vnode, isMounted } = this._currentPropertyAccessInstance
        if (!isMounted || !vnode) {
            return null
        }
        // 不会包括style元素
        let els = getEdgeElements(vnode.filter((_vnode: any) => _vnode.type !== 'style'))
        // 有多个根元素会返回多个元素
        return els.length === 1 ? els[0] : els
    },
    get $root() {
        return this._currentPropertyAccessInstance.root
    },
    get $props() {
        return this._currentPropertyAccessInstance.props
    }, // props包括 props， attrs 和 events
    get $attrs() {
        return this._currentPropertyAccessInstance.attrs ||= {}
    },
    get $slots() {
        return this._currentPropertyAccessInstance.slots
    },
    get $parent() {
        return this._currentPropertyAccessInstance.parent
    },
    get $watch() {
        return this._currentPropertyAccessInstance.watch
    },
    get $nextTick() {
        return nextTick.bind(this._currentPropertyAccessInstance.scope)
    },
    get $self() {
        return this._currentPropertyAccessInstance.scope
    },
    get $forceUpdate() {
        if (!this._currentPropertyAccessInstance.isMounted) {
            return this._currentPropertyAccessInstance.update
        }
    },
    // evnets
    get $emit() {
        return this._currentPropertyAccessInstance.emit
    }, // init component instance
    get $on() {
        return this._currentPropertyAccessInstance.on
    },
    get $off() {
        return this._currentPropertyAccessInstance.off
    },
    get $once() {
        return this._currentPropertyAccessInstance.once
    },
    // 查询当前组件内的元素 , 组件的话返回组件实例
    get $querySelector() {
        return (selector: any) => {
            // 先当做组件选择器，如果不是定义的组件则当做普通元素
            let type = this._currentPropertyAccessInstance?.components?.[selector] || selector
            return querySelector(type, this._currentPropertyAccessInstance.vnode)
        }
    },
    get $querySelectorAll() {
        return (selector: any) => {
            // 先当做组件选择器，如果不是定义的组件则当做普通元素
            let type = this._currentPropertyAccessInstance?.components?.[selector] || selector
            return querySelectorAll(type, this._currentPropertyAccessInstance.vnode)
        }
    },
}


export const defineScopeProperty = (key: string, property: any) => scopeProperties[key] = property

const protoMethods: any = {
    debounce,
    throttle,
    lighten,
    darken,
    saturate,
    desaturate,
    opacity,
    ...cssMethods,
}


// inject scope property
export function createScope(instance: any) {
    const scope = reactive(Object.create(protoMethods))
    return new Proxy(scope, {
        get(target: any, key: any, receiver: any) {
            scopeProperties._currentPropertyAccessInstance = instance
            let value = hasOwn(scopeProperties, key) ? scopeProperties[key] : Reflect.get(target, key, receiver)
            return value
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

// 当作用域没有值时显示的默认值
const defaultTemplateScopeValue = ''

export function createRenderScope(instanceScope: any) {
    return new Proxy(instanceScope, {
        get(target: any, key: any, receiver: any) {

            if (hasOwn(specialTemplateMethods, key)) {
                return specialTemplateMethods[key]
            }

            // todo magic variables
            var result = Reflect.get(target, key, receiver)
            return isRef(result) ? result.value : result
        }
    })
}

