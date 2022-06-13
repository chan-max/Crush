import { isFunction, isObject, mark } from "@crush/common"
import { resolveOptions } from "./option"


export const enum Components {

    OPTIONS_COMPONENT,

    ASYNC_COMPONENT,
    RESOLVED_ASYNC_COMPONENT,

    RENDER_COMPONENT
}

export const COMPONENT_TYPE = Symbol('component_type')

// options component
export function component(component: any) {
    mark(component, COMPONENT_TYPE, Components.OPTIONS_COMPONENT)
    resolveOptions(component)
    return component
}


// ! 移除函数式有状态组件

export function asyncComponent(source: any) {
    if (isFunction(source)) {
        source = {
            resolved: false,
            loader: source,
            loadingComponent: '',
            errorComponent: '',
            timeout: 200
        }
    }
    mark(source, COMPONENT_TYPE, Components.ASYNC_COMPONENT)
    return source
}

export function processComponent(source: any) {
    if (source[COMPONENT_TYPE]) {
        return source
    } else if (isObject(source)) {
        return component(source)
    } else if (isFunction(source)) {
        mark(source, COMPONENT_TYPE, Components.RENDER_COMPONENT)
        return source
    }
}