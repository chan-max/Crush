
/*
    mixin supports 
    ---
    same as directive

    mixin nesting

*/


import { error } from '@crush/common'
import { isFunction, isObject } from '@crush/common/src/dataType'
import {
    injectHook, LifecycleHooks
} from './lifecycle'

import {
    ComponentOptionKeys
} from './options'


export function injectMixin(options: any, mixin: any) {
    for (let key in mixin) {
        switch (key) {
            case ComponentOptionKeys.MIXINS:
                injectMixins(options, options[key])
                break
            case ComponentOptionKeys.BEFORE_CREATE:
            case ComponentOptionKeys.CREATE:
            case ComponentOptionKeys.CREATED:
            case ComponentOptionKeys.BEFORE_MOUNT:
            case ComponentOptionKeys.MOUNTED:
            case ComponentOptionKeys.BEFORE_UPDATE:
            case ComponentOptionKeys.UPDATED:
            case ComponentOptionKeys.BEFORE_UNMOUNT:
            case ComponentOptionKeys.UNMOUNTED:
                injectHook(key as any, options, mixin[key])
                break
            default:
                debugger
        }
    }
    // ! 
    return options
}

export function injectMixins(target: any, mixins: any[]) {
    mixins.forEach((mixin: any) => {
        injectMixin(target, mixin)
    })
    return target
}

