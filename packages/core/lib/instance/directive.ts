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
export function processHook(type: LifecycleHooks, next: any, previous: any = null) {
    // 不存在两个节点都不存在
    if (previous) {
        if (next.patchKey === previous.patchKey) {
            // same node update
            doProcessHook(type, next, previous)
        } else {
            // fake mount and unmount
            // 卸载旧节点 beforeUnmount , unmounted
            // 挂载新节点 beforeCreate , created , beforeMount , mounted
            if (type === LifecycleHooks.BEFORE_UPDATE) {
                processHook(LifecycleHooks.BEFORE_UNMOUNT, previous)
                processHook(LifecycleHooks.UNMOUNTED, previous)
            } else if (type === LifecycleHooks.UPDATED) {
                processHook(LifecycleHooks.BEFORE_CREATE, next)
                processHook(LifecycleHooks.CREATED, next)
                processHook(LifecycleHooks.BEFORE_MOUNT, next)
                processHook(LifecycleHooks.MOUNTED, next)
            }
        }
    } else {
        doProcessHook(type, next)
    }
}

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

function doProcessHook(type: LifecycleHooks, next: any, previous: any = undefined) {
    const isComponent = next.nodeType === Nodes.COMPONENT
    if (isComponent) {
        var instance = next.instance
        // 组件需要处理实例钩子
        var scope = instance.scope
        callHook(type, instance, { binding: scope }, scope)
    }

    var dirs = next?.props?._dirs

    if (!dirs) return
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