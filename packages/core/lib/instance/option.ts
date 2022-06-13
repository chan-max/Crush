import { isArray } from "@crush/common";
import { ComponentType } from "./component";
import {
    injectMixins
} from './mixin'
import {
    compile
} from '@crush/compiler'
import { normalizePropsOptions } from "./props";

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
    RENDER = 'render',

    PROPS = 'props',

    EMITS = 'emits',

    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives'
}

export function resolveOptions(options: ComponentType | any) {
    for (let key in options) {
        const value = options[key]
        switch (key) {
            case ComponentOptions.PROPS:
                options.propsOptions = normalizePropsOptions(value)
                break
            case ComponentOptions.EMITS:
                options.emitsOptions = normalizePropsOptions(value)
                break
            case ComponentOptions.TEMPLATE:
                options.createRender = compile(value as string)
                break
            case ComponentOptions.RENDER:
                // todo
                break
            case ComponentOptions.CREATE:
            case ComponentOptions.BEFORE_CREATE:
            case ComponentOptions.CREATED:
            case ComponentOptions.BEFORE_MOUNT:
            case ComponentOptions.MOUNTED:
            case ComponentOptions.BEFORE_UPDATE:
            case ComponentOptions.UPDATED:
            case ComponentOptions.BEFORE_UNMOUNT:
            case ComponentOptions.UNMOUNTED:
                // 转换为数组形式
                if (value && !isArray(value)) {
                    options[key] = [value]
                }
                break
            case ComponentOptions.COMPOENNTS:
                break
            case ComponentOptions.DIRECTIVES:
                break
            //! remove to create instance
            // case ComponentOptions.MIXINS:
            //     var mixins = value
            //     injectMixins(options, mixins as any[])
            //     break
            default:
                /*custom options*/
                const customOptions = options.customOptions ||= {}
                customOptions[key] = value
                break
        }
    }
}