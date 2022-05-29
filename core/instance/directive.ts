

export type DirectiveType = {
    beforeCreate?:Function
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

export function injectDirective(target: any, dir: any) {
    // 指令会携带信息 值 参数 修饰符
    var dirs = target.dirs ||= new Map()
    dirs.set(dir.directive, dir)
    // ! 
    return target
}

import {
    LifecycleHooks
} from './lifecycle'
import { EMPTY_ARR } from '../common/value'
import { isFunction } from '../common/type'

export function processHook(type: LifecycleHooks, next: any, previous: any = null) {
    // 不存在两个节点都不存在
    if (previous) {
        if (next.patchKey === previous.patchKey) {
            // same node update
            processDirHook(type, next, previous)
        } else {
            // fake mount and unmount
            // 卸载旧节点 beforeUnmount , unmounted
            // 挂载新节点 beforeCreate , created , beforeMount , mounted
            if (type === LifecycleHooks.BEFORE_UPDATE) {
                processHook(LifecycleHooks.BEFORE_UNMOUNT, previous)
                processHook(LifecycleHooks.BEFORE_CREATE, next)
                processHook(LifecycleHooks.BEFORE_MOUNT, next)
            } else if (type === LifecycleHooks.UPDATED) {
                processHook(LifecycleHooks.UNMOUNTED, previous)
                processHook(LifecycleHooks.CREATED, next)
                processHook(LifecycleHooks.MOUNTED, next)
            }
        }
    } else {
        processDirHook(type, next)
    }
}

function normalizeDirective(directive: any) {
    return isFunction(directive) ? {
        mounted: directive,
        updated: directive
    } : directive
}

function processDirHook(type: LifecycleHooks, next: any, previous: any = null) {
    for (let [dir, infos] of next.dirs || EMPTY_ARR) {
        var _dir = normalizeDirective(dir)
        var hook = _dir[type]
        if (hook) {
            if (previous) {
                infos.oldValue = previous.dirs.get(dir).value
            }
            hook(next.ref, infos, next)
        }
    }
}