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



export function injectDirectives(target: any, directives: any[]) {
    for (let directive of directives) {
        injectDirective(target, directive)
    }
    return target
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

/*
    指令注入不能直接添加在钩子中 ，需要额外处理指令信息等
*/
export function injectDirective(target: any, [directive, value, _arguments, modifiers]: any) {
    // 指令会携带信息 值 参数 修饰符
    var dirs = target.dirs ||= new Map()
    const infos = {
        value,
        directive,
        _arguments: _arguments && setOwnKey(_arguments),
        modifiers: modifiers && setOwnKey(modifiers)
    }
    dirs.set(directive, infos)
    // ! 
    return target
}

import {
    LifecycleHooks
} from './lifecycle'

import { isFunction, EMPTY_ARR } from '@crush/common'
import { callHook } from './lifecycle'
import { scope } from '../../../../recycler/crush/compiler/generator/const'
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


function doProcessHook(type: LifecycleHooks, next: any, previous: any = undefined) {
    const isComponent = next.nodeType === Nodes.COMPONENT
    if (isComponent) {
        var instance = next.instance
        // 组件需要处理实例钩子
        callHook(type, instance, { binding: instance.scope }, scope)
    }

    for (let [dir, infos] of next.dirs || EMPTY_ARR) {
        var _dir = normalizeDirective(dir)
        var hook = _dir[type]
        if (hook) {
            if (previous) {
                infos.oldValue = previous.dirs.get(dir).value
            }
            // 
            hook(isComponent ? next.instance.scope : next.el, infos, next, previous)
        }
    }
}