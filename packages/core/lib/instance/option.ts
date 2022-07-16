import { isArray } from "@crush/common";
import { ComponentType } from "./component";

import {
    compile
} from '@crush/compiler'
import { normalizeEmitsOptions, normalizePropsOptions } from "./props";

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

    BEFORE_PATCH = 'beforePatch',

    // keepalive
    ACTIVATED = 'activated',
    DEACTIVATED = 'deactivated',

    TEMPLATE = 'template',
    RENDER = 'render',

    PROPS = 'props',

    EMITS = 'emits',

    NAME = 'name',

    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives',


}




export function resolveOptions(options: any) {
    for (let key in options) {
        const value = options[key]
        switch (key) {
            case ComponentOptions.PROPS:
                options.propsOptions = normalizePropsOptions(value)
                break
            case ComponentOptions.EMITS:
                options.emitsOptions = normalizeEmitsOptions(value)
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
            case ComponentOptions.BEFORE_PATCH:
            case ComponentOptions.ACTIVATED:
            case ComponentOptions.DEACTIVATED:
                // 转换为数组形式
                if (value && !isArray(value)) {
                    options[key] = [value]
                }
                break
            case ComponentOptions.COMPOENNTS:
                break
            case ComponentOptions.DIRECTIVES:
                break
            case ComponentOptions.NAME:
                break
            default:
                /*custom options*/
                const customOptions = options.customOptions ||= {}
                customOptions[key] = value
                break
        }

        // 组件定义了name 可以递归
        if(options[ComponentOptions.NAME]){
            (options[ComponentOptions.COMPOENNTS] ||= {})[options[ComponentOptions.NAME]] = options
        }
    }
}