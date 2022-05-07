import { compile } from "../../../dev/node_modules/@crush/compiler"
import {
    injectHook,
    LifecycleHooks
} from './lifecycle'

import {
    isArray
} from '@crush/common'

export enum ComponentOptions {

    BEFORE_CREATE = 'beforeCreate',

    CREATE = 'create',
    // setup funcition
    CREATED = 'created',
    BEFORE_MOUNT = 'beforeMount',
    MOUNTED = 'mounted',
    BEFORE_UPDATE = 'beforeUpdate',
    UPDATED = 'updated',
    BEFORE_UNMOUNT = 'beforeUnmount',
    UNMOUNTED = 'unmounted',
    TEMPLATE = 'template',
    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives'
}

export const initOptions = (options: any, target = null) => {
    var initTarget: any, isMixin = false;
    if (target) {
        initTarget = target
        isMixin = true
    } else {
        initTarget = options
    }
    for (let key in options) {
        switch (key) {
            // root options only
            case ComponentOptions.TEMPLATE:
                initTarget.createRender = compile(options[ComponentOptions.TEMPLATE])
                console.log('RENDER_CREATOR', initTarget.createRender);
                break
            case ComponentOptions.CREATE:
                options[LifecycleHooks.CREATE] = [options[LifecycleHooks.CREATE]]
                break
            case ComponentOptions.CREATED:
                options[LifecycleHooks.CREATED] = [options[LifecycleHooks.CREATED]]
                break
            case ComponentOptions.BEFORE_MOUNT:
                options[LifecycleHooks.BEFORE_MOUNT] = [options[LifecycleHooks.BEFORE_MOUNT]]
                break
            case ComponentOptions.MOUNTED:
                options[LifecycleHooks.MOUNTED] = [options[LifecycleHooks.MOUNTED]]
                break
            case ComponentOptions.BEFORE_UNMOUNT:
                options[LifecycleHooks.BEFORE_UNMOUNT] = [options[LifecycleHooks.BEFORE_UNMOUNT]]
                break
            case ComponentOptions.UNMOUNTED:
                options[LifecycleHooks.UNMOUNTED] = [options[LifecycleHooks.UNMOUNTED]]
                break
            case ComponentOptions.BEFORE_UPDATE:
                options[LifecycleHooks.BEFORE_UPDATE] = [options[LifecycleHooks.BEFORE_UPDATE]]
                break
            case ComponentOptions.UPDATED:
                options[LifecycleHooks.UPDATED] = [options[LifecycleHooks.UPDATED]]
                break
            case ComponentOptions.MIXINS:
                options[ComponentOptions.MIXINS].forEach((mixin: any) => {
                    initOptions(mixin, initTarget)
                })
                break
            case ComponentOptions.COMPOENNTS:
                break
            case ComponentOptions.DIRECTIVES:
                debugger
                break
            default:
                /*custom options*/
                break
        }
    }
    if (!isMixin) {
        options._isOptions = true
    }
}