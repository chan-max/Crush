import { isFunction, isObject, mark } from "@crush/common"
import { resolveOptions } from "./option"


export const enum Components {

    OPTIONS_COMPONENT,
    FUNCTIONAL_COMPONENT,

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

// 函数组件默认是无状态组件 ， 有状态的函数组件需要特殊声明
export function functionalComponent (component: any) {
    component = { name: component.name, rootCreate: component }
    mark(component, COMPONENT_TYPE, Components.FUNCTIONAL_COMPONENT)
    return component
}

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