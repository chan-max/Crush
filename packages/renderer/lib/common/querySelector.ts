
//  基于 vnode 的元素选择器，在vnode树中查找元素，必须是处理过的树，也可以查询组件等

import { isFunction, isObject } from "@crush/common"
import { Nodes } from "@crush/const"

/*
    *  所有元素
    #  id 选择器
    .  class 选择器
    普通标签选择 ， 组件会返回实例
*/

// 如果是组件标签的话，直接通过实例身上的components，可获得组件的type

enum QuerySelectorType {
    ID,
    CLASS,
    ELEMENT_TYPE,
    COMPONENT_TYPE,
    RENDER_COMPONENT_TYPE // 渲染函数没有实例
}


function parseQuerySelector(selector: any) {
    let type, value
    if (isFunction(selector)) {
        // render component
        type = QuerySelectorType.RENDER_COMPONENT_TYPE
        value = selector
    } else if (isObject(selector)) {
        type = QuerySelectorType.COMPONENT_TYPE
        value = selector
    } else if (selector.startsWith('.')) {
        type = QuerySelectorType.CLASS
        value = selector.slice(1)
    } else if (selector.startsWith('#')) {
        type = QuerySelectorType.ID
        value = selector.slice(1)
    } else {
        type = QuerySelectorType.ELEMENT_TYPE
        value = selector
    }
    return {
        type,
        value
    }
}

export function querySelector(selector: any, vnode: any): any {
    if (!selector || !vnode) {
        return null
    }
    let { type, value } = parseQuerySelector(selector)
    return doQuerySelector(value, type, vnode)
}



function doQuerySelector(selector: any, type: QuerySelectorType, vnode: any): any {

    let result = null

    // vnode 始终是数组形式 
    for (let item of vnode) {
        if (type === QuerySelectorType.CLASS) {
            // class 中 selector 为 true
            if (item?.props?.class?.[selector]) {
                result = item.el || item.instance
                break
            }
        } else if (type === QuerySelectorType.ID) {
            if (item?.props?.id === selector) {
                result = item.el || item.instance
                break
            }
        } else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
            if (item.type === selector) {
                result = item.el || item.instance // 元素节点身上也有 instance属性
                break
            }
        } else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) {
            // render component 暂时没有相应的元素或实例
            // 或者 render component 返回对应的子元素或实例
            result = null
        } else {
            continue
        }

        if (item.children && (item.nodeType == Nodes.HTML_ELEMENT || item.nodeType == Nodes.SVG_ELEMENT)) {
            // 有状态组件，无状态组件，样式表 不会寻找子元素
            result = doQuerySelector(selector, type, item.children)
        }
    }

    return result
}




export function querySelectorAll(selector: any, vnode: any) {
    if (!selector || !vnode) {
        return null
    }
    let { type, value } = parseQuerySelector(selector)
    return doQuerySelectorAll(value, type, vnode, [])
}

function doQuerySelectorAll(selector: any, type: QuerySelectorType, vnode: any, results: any) {
    for (let item of vnode) {
        if (type === QuerySelectorType.CLASS) {
            // class 中 selector 为 true
            if (item?.props?.class?.[selector]) {
                results.push(item.el || item.instance)
            }
        } else if (type === QuerySelectorType.ID) {
            if (item?.props?.id === selector) {
                results.push(item.el || item.instance)
            }
        } else if (type === QuerySelectorType.ELEMENT_TYPE || type === QuerySelectorType.COMPONENT_TYPE) {
            if (item.type === selector) {
                results.push(item.el || item.instance)
            }
        } else if (type === QuerySelectorType.RENDER_COMPONENT_TYPE) {
            // render component 暂时没有相应的元素或实例
            // 或者 render component 返回对应的子元素或实例
        } else {
            continue
        }

        if (item.children && (item.nodeType == Nodes.HTML_ELEMENT || item.nodeType == Nodes.SVG_ELEMENT)) {
            // 有状态组件，无状态组件，样式表 不会寻找子元素
            doQuerySelectorAll(selector, type, item.children, results)
        }
    }

    return results
}