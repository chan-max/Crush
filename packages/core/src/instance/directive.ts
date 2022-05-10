
import { error } from '@crush/common'
import { isFunction, isObject } from '@crush/common/src/dataType'
import {
    injectHook, LifecycleHooks
} from './lifecycle'

export type Directive = Function | Record<LifecycleHooks, Function>

export function injectDirective(target: any, directive: any) {
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

export function injectDirectives(target: any, directives: any[]) {
    directives.forEach((directive: any) => {
        injectDirective(target, directive)
    })
    return target
}

