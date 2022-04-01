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
                initTarget.renderCreator = compile(options[ComponentOptions.TEMPLATE])
                break
            case ComponentOptions.CREATE:
                injectHook(initTarget, LifecycleHooks.CREATE, options[ComponentOptions.CREATE])
                break
            case ComponentOptions.CREATED:
                injectHook(initTarget, LifecycleHooks.CREATED, options[ComponentOptions.CREATED])
                break
            case ComponentOptions.BEFORE_MOUNT:
                injectHook(initTarget, LifecycleHooks.BEFORE_MOUNT, options[ComponentOptions.BEFORE_MOUNT])
                break
            case ComponentOptions.MOUNTED:
                injectHook(initTarget, LifecycleHooks.MOUNTED, options[ComponentOptions.MOUNTED])
                break
            case ComponentOptions.BEFORE_UNMOUNT:
                injectHook(initTarget, LifecycleHooks.BEFORE_UNMOUNT, options[ComponentOptions.BEFORE_UNMOUNT])
                break
            case ComponentOptions.UNMOUNTED:
                injectHook(initTarget, LifecycleHooks.UNMOUNTED, options[ComponentOptions.UNMOUNTED])
                break
            case ComponentOptions.BEFORE_UPDATE:
                injectHook(initTarget, LifecycleHooks.BEFORE_UPDATE, options[ComponentOptions.BEFORE_UPDATE])
                break
            case ComponentOptions.UPDATED:
                injectHook(initTarget, LifecycleHooks.UPDATED, options[ComponentOptions.UPDATED])
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