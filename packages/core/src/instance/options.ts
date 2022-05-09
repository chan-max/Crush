import { compile } from "../../../dev/node_modules/@crush/compiler"
import {
    injectHook,
    LifecycleHooks
} from './lifecycle'


export enum ComponentOptionKeys {

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
    RENDER = 'render',

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
            case ComponentOptionKeys.TEMPLATE:
                initTarget.createRender = compile(options[ComponentOptionKeys.TEMPLATE])
                console.log('RENDER_CREATOR', initTarget.createRender);
                break
            case ComponentOptionKeys.CREATE:
                options[LifecycleHooks.CREATE] = [options[LifecycleHooks.CREATE]]
                break
            case ComponentOptionKeys.CREATED:
                options[LifecycleHooks.CREATED] = [options[LifecycleHooks.CREATED]]
                break
            case ComponentOptionKeys.BEFORE_MOUNT:
                options[LifecycleHooks.BEFORE_MOUNT] = [options[LifecycleHooks.BEFORE_MOUNT]]
                break
            case ComponentOptionKeys.MOUNTED:
                options[LifecycleHooks.MOUNTED] = [options[LifecycleHooks.MOUNTED]]
                break
            case ComponentOptionKeys.BEFORE_UNMOUNT:
                options[LifecycleHooks.BEFORE_UNMOUNT] = [options[LifecycleHooks.BEFORE_UNMOUNT]]
                break
            case ComponentOptionKeys.UNMOUNTED:
                options[LifecycleHooks.UNMOUNTED] = [options[LifecycleHooks.UNMOUNTED]]
                break
            case ComponentOptionKeys.BEFORE_UPDATE:
                options[LifecycleHooks.BEFORE_UPDATE] = [options[LifecycleHooks.BEFORE_UPDATE]]
                break
            case ComponentOptionKeys.UPDATED:
                options[LifecycleHooks.UPDATED] = [options[LifecycleHooks.UPDATED]]
                break
            case ComponentOptionKeys.MIXINS:
                options[ComponentOptionKeys.MIXINS].forEach((mixin: any) => {
                    initOptions(mixin, initTarget)
                })
                break
            case ComponentOptionKeys.COMPOENNTS:
                break
            case ComponentOptionKeys.DIRECTIVES:
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