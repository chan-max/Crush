import { compile } from "../../../dev/node_modules/@crush/compiler"
import {
    injectHook,
    LifecycleHooks
} from './lifecycle'

import {
    isArray
} from '@crush/common'

export enum ComponentOptions {
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
                console.log('RENDER_CREATOR',initTarget.createRender);
                break
            case ComponentOptions.CREATE:
                injectHook( LifecycleHooks.CREATE,initTarget, options[ComponentOptions.CREATE])
                break
            case ComponentOptions.CREATED:
                injectHook( LifecycleHooks.CREATED,initTarget, options[ComponentOptions.CREATED])
                break
            case ComponentOptions.BEFORE_MOUNT:
                injectHook( LifecycleHooks.BEFORE_MOUNT,initTarget, options[ComponentOptions.BEFORE_MOUNT])
                break
            case ComponentOptions.MOUNTED:
                injectHook(LifecycleHooks.MOUNTED,initTarget,  options[ComponentOptions.MOUNTED])
                break
            case ComponentOptions.BEFORE_UNMOUNT:
                injectHook( LifecycleHooks.BEFORE_UNMOUNT,initTarget, options[ComponentOptions.BEFORE_UNMOUNT])
                break
            case ComponentOptions.UNMOUNTED:
                injectHook( LifecycleHooks.UNMOUNTED,initTarget, options[ComponentOptions.UNMOUNTED])
                break
            case ComponentOptions.BEFORE_UPDATE:
                injectHook(LifecycleHooks.BEFORE_UPDATE, initTarget, options[ComponentOptions.BEFORE_UPDATE])
                break
            case ComponentOptions.UPDATED:
                injectHook( LifecycleHooks.UPDATED,initTarget, options[ComponentOptions.UPDATED])
                break
            case ComponentOptions.MIXINS:
                options[ComponentOptions.MIXINS].forEach((mixin: any) => {
                    initOptions(mixin, initTarget)
                })
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