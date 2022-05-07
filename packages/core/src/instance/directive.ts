
import { isFunction, isObject } from '@crush/common/src/dataType'
import {
    injectHook, LifecycleHooks
} from './lifecycle'

function injectDirective(target: any, directive: Function | Record<string, any>) {
    if (isFunction(directive)) {
        directive = {
            [LifecycleHooks.MOUNTED]: directive,
            [LifecycleHooks.UPDATED]: directive
        }
    }

    for (let key in directive) {
        switch (key) {
            case LifecycleHooks.CREATED:

                break
            case LifecycleHooks.BEFORE_MOUNT:
                break
            case LifecycleHooks.MOUNTED:
                break
            case LifecycleHooks.BEFORE_UPDATE:
                break
            case LifecycleHooks.UPDATED:
                
                break
            case LifecycleHooks.BEFORE_UNMOUNT:
                break
            case LifecycleHooks.UNMOUNTED:
                break
        }
    }
    // ! 
    return target
}
