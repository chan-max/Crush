import { isArray } from "../common/type";
import { ComponentType } from "./component";

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

    MIXINS = 'mixins',
    COMPOENNTS = 'components',
    DIRECTIVES = 'directives'
}

export function initOptions(options: ComponentType) {
    for (let key in options) {
        switch (key) {
            case ComponentOptions.TEMPLATE:
                options.createRender = () => { }
                break
            case ComponentOptions.RENDER:
                // todo
                break
            case ComponentOptions.BEFORE_CREATE:
            case ComponentOptions.CREATE:
            case ComponentOptions.CREATED:
            case ComponentOptions.BEFORE_MOUNT:
            case ComponentOptions.MOUNTED:
            case ComponentOptions.BEFORE_UPDATE:
            case ComponentOptions.UPDATED:
            case ComponentOptions.BEFORE_UNMOUNT:
            case ComponentOptions.UNMOUNTED:
                var option = options[key]
                if (option && !isArray(option)) {
                    options[key] = [option]
                }
                break
            case ComponentOptions.MIXINS:
                var mixins = options[key]
                injectMixins(options, mixins as any[])
                break
            case ComponentOptions.COMPOENNTS:
                break
            case ComponentOptions.DIRECTIVES:
                break
            default:
                /*custom options*/
                break
        }
    }
    options._isOptions = true
}