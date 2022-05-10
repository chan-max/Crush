import { isArray } from "@crush/common";
import { compile } from "../../../dev/node_modules/@crush/compiler"
import { Directive } from "./directive";
import {
    injectHook,
    LifecycleHooks
} from './lifecycle'
import { injectMixins } from "./mixin";

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

    PROPS = 'props',

    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives'
}

export interface ComponentOptions {
    _isOptions?: boolean
    createRender?: Function
    [ComponentOptionKeys.TEMPLATE]?: string,
    [ComponentOptionKeys.RENDER]?: Function,

    [ComponentOptionKeys.DIRECTIVES]?: Record<string, Directive>,
    [ComponentOptionKeys.COMPOENNTS]?: Record<string, ComponentOptions>,
    [ComponentOptionKeys.MIXINS]?: ComponentOptions[],

    [ComponentOptionKeys.BEFORE_CREATE]?: Function | Function[],
    [ComponentOptionKeys.CREATE]?: Function | Function[],
    [ComponentOptionKeys.CREATED]?: Function | Function[],
    [ComponentOptionKeys.BEFORE_MOUNT]?: Function | Function[],
    [ComponentOptionKeys.MOUNTED]?: Function | Function[],
    [ComponentOptionKeys.BEFORE_UPDATE]?: Function | Function[],
    [ComponentOptionKeys.UPDATED]?: Function | Function[],
    [ComponentOptionKeys.BEFORE_UNMOUNT]?: Function | Function[],
    [ComponentOptionKeys.UNMOUNTED]?: Function | Function[],
}


export const initOptions = (options: ComponentOptions) => {
    for (let key in options) {
        switch (key) {
            // root options only
            case ComponentOptionKeys.TEMPLATE:
                options.createRender = compile(options[ComponentOptionKeys.TEMPLATE] as string)
                break
            case ComponentOptionKeys.RENDER:
                // todo
                break
            case ComponentOptionKeys.CREATE:
            case ComponentOptionKeys.CREATED:
            case ComponentOptionKeys.BEFORE_MOUNT:
            case ComponentOptionKeys.MOUNTED:
            case ComponentOptionKeys.BEFORE_UPDATE:
            case ComponentOptionKeys.UPDATED:
            case ComponentOptionKeys.BEFORE_UNMOUNT:
            case ComponentOptionKeys.UNMOUNTED:
                var option = options[key]
                // all lifecycle hooks should be an array in options or compoennt instance
                if (option && !isArray(option)) {
                    options[key] = [option]
                }
                break
            case ComponentOptionKeys.MIXINS:
                var mixins = options[key]
                injectMixins(options, mixins as any[])
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
    options._isOptions = true
}