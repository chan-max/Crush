
import { error } from '@crush/common'
import { isFunction, isObject } from '@crush/common/src/dataType'
import { EMPTY_ARR } from '@crush/common/src/value'
import { callFn } from '../../../compiler/src/generator/stringify'
import {
    callHook,
    injectHook, LifecycleHooks
} from './lifecycle'

export function injectDirectives(target: any, directives: any[]) {
    for (let directive of directives) {
        injectDirective(target, directive)
    }
    return target
}

export function injectDirective(target: any, [directive, info]: any) {
    // 指令会携带信息 值 参数 修饰符
    var dirs = target.dirs ||= new Map()
    dirs.set(directive, info)
    // ! 
    return target
}

export function injectReservedProps(target: any, props: any) {
    target._props = props
    return target
}

export function processHook(type: LifecycleHooks, p: any, n: any) {
    // 不存在两个节点都不存在
    if (p && n) {
        // ! 只有更新时指令才能拿到 oldValue
        // update 包括普通更新和假卸载和挂载的更新
        if (p.patchKey === n.patchKey) {
            // 更新
            for (let [directive, info] of n.dirs || EMPTY_ARR) {
                var hook = directive[type]
                if (hook) {
                    info.oldValue = p.dirs.get(directive).value
                    hook(n.ref, info)
                }
            }
        } else {

            // 卸载旧节点
            for (let [directive, info] of p.dirs || EMPTY_ARR) {
                var hook = directive[type === LifecycleHooks.BEFORE_UPDATE ? LifecycleHooks.BEFORE_UNMOUNT : LifecycleHooks.UNMOUNTED]
                if (hook) { hook(p.ref, info) }
            }

            // 挂载新节点
            for (let [directive, info] of p.dirs || EMPTY_ARR) {
                var hook = directive[type === LifecycleHooks.UPDATED ? LifecycleHooks.MOUNTED : LifecycleHooks.BEFORE_MOUNT]
                if (hook) { hook(p.ref, info) }
            }
        }

    } else {
        //  卸载和挂载
        var target = p || n
        for (let [directive, info] of target.dirs || EMPTY_ARR) {
            var hook = directive[type]
            if (hook) { hook(target.ref, info) }
        }
    }
}

