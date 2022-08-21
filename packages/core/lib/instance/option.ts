import { isArray } from "@crush/common";
import { ComponentType } from "./component";

import {
    compile
} from '@crush/compiler'
import { normalizeEmitsOptions, normalizePropsOptions } from "./props";

export const enum ComponentOptions {
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

    BEFORE_ROUTE_ENTER = 'beforeRouteEnter',
    BEFORE_ROUTE_LEAVE = 'beforeRouteLeave',
    BEFORE_ROUTE_UPDATE = 'beforeRouteUpdate',

    TEMPLATE = 'template',
    RENDER = 'render',

    PROPS = 'props',

    EMITS = 'emits',

    NAME = 'name',

    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives',

    // 手写render时需要指定该选项
    SCOPED_ID = 'scopedId'
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
                let render = compile(value as string)
                let {
                    createRender
                } = render
                options.createRender = createRender
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
            case ComponentOptions.BEFORE_ROUTE_ENTER:
            case ComponentOptions.BEFORE_ROUTE_LEAVE:
            case ComponentOptions.BEFORE_ROUTE_UPDATE:
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
            case ComponentOptions.SCOPED_ID:
                break
            default:
                break
        }

        // 组件定义了name 可以递归 
        // 这种是组件配置的名称，但可以被create中注册的名字替代
        if (options[ComponentOptions.NAME]) {
            (options[ComponentOptions.COMPOENNTS] ||= {})[options[ComponentOptions.NAME]] = options
        }
    }
}

