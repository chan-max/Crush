
import { error } from '@crush/common'
import { isFunction, isObject } from '@crush/common/src/dataType'
import {
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

    var dirInfos: Map<any, any> = target.dirInfos ||= new Map()

    // 保存指令携带的信息
    dirInfos.set(directive, info)

    if (isFunction(directive)) {
        directive = {
            [LifecycleHooks.MOUNTED]: directive,
            [LifecycleHooks.UPDATED]: directive
        }
    }

    for (let key in directive) {
        injectHook(key as LifecycleHooks, target, directive[key])
    }
    // ! 
    return target
}

export function callDirectiveHook(type: LifecycleHooks, target: any, binding: any = null, ...args: any[]) {
    // ! 与调用 普通钩子不同的是 会多传入一个指令信息
}

