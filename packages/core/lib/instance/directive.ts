import { Nodes } from '@crush/const'

export type DirectiveType = {
    beforeCreate?: Function
    created?: Function
    beforeMount?: Function
    mounted?: Function
    beforeUpdate?: Function
    updated?: Function
    beforeUnmount?: Function
    unmounted?: Function
} | Function


import {
    LifecycleHooks
} from './lifecycle'

import { isFunction, emptyArray } from '@crush/common'
import { callHook } from './lifecycle'
/* 
    pervious 节点存在一定是更新 ， 但可能存在key不相同，此时需要进入节点的卸载和新节点的挂载
*/

function normalizeDirective(directive: any) {
    return isFunction(directive) ? {
        mounted: directive,
        updated: directive
    } : directive
}

/*
    参数和修饰符是一个数组结构但自身挂载了所有的key，可以灵活运用
*/
function setOwnKey(arr: any[]) {
    for (let key of arr) {
        arr[key] = true
    }
    return arr
}

export function processHook(type: LifecycleHooks, next: any, previous: any = undefined) {
    // 在这不需要判断 两个节点的patchkey是否相同
    const isComponent = next.nodeType === Nodes.COMPONENT
    if (isComponent) {
        var instance = next.instance
        // 组件需要处理实例钩子
        var scope = instance.scope
        callHook(type, instance, { binding: scope }, scope)
    }

    // 指令钩子
    var dirs = next?.props?._dirs

    if (dirs) {
        for (let [dir, [value, _arguments, modifiers]] of dirs) {
            var _dir = normalizeDirective(dir)
            var hook = _dir[type]
            if (hook) {
                var bindings: any = {
                    directive: dir, //保留原始指令
                    value,
                    _arguments: _arguments && setOwnKey(_arguments),
                    modifiers: modifiers && setOwnKey(modifiers)
                }
                if (previous) {
                    bindings.oldValue = previous?.props?._dirs.get(dir)[0]
                }
                // 
                hook(isComponent ? next.instance.scope : next.el, bindings, next, previous)
            }
        }
    }

    // 节点钩子
    const vnodeHook = next?.props?.[`_${type}`]
    if (vnodeHook) {
        vnodeHook(isComponent ? next.instance.scope : next.el)
    }
}