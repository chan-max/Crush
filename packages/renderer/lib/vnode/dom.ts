import { isFunction, isObject, mark, uid } from "@crush/common"
import { Nodes } from "@crush/const"
import {  resolveOptions } from "@crush/core"





const COMPONENT_TYPE = Symbol('ComponentType')

function createComponent(type: any, props: any, children: any, key: any = uid()) {
    let componentFlag = type[COMPONENT_TYPE]
    if (!componentFlag) {
        // stateful component
        if (isObject(type)) {
            componentFlag = Nodes.COMPONENT
            resolveOptions(type)
        } else if (isFunction(type)) {
            // render component
            componentFlag = Nodes.RENDER_COMPONENT
        }
        mark(type, COMPONENT_TYPE, componentFlag)
    }

    return {
        nodeType: componentFlag,
        type,
        props,
        children,
        key
    }
}

function createElement(type: string, props: any, children: any, key: any = uid()) {
    return {
        nodeType: Nodes.HTML_ELEMENT,
        type,
        props,
        children,
        key
    }
}

export function createSVGElement(type: string, props: any, children: any, key: any = uid()) {
    return {
        nodeType: Nodes.SVG_ELEMENT,
        type,
        props,
        children,
        key
    }
}



export const Text = Symbol('Text')

// the key is for other node
function createText(children: any, key = uid()) {
    return {
        nodeType: Nodes.TEXT,
        children,
        key
    }
}

export const Comment = Symbol('Comment')
export function createComment(text: any, key = uid()) {
    return {
        type: Comment,
        nodeType: Nodes.HTML_COMMENT,
        children: text,
        key
    }
}

const Fragment = Symbol('Fragment')
function createFragment(children: any, key = uid()) {
    return {
        nodeType: Nodes.FRAGMENT,
        children,
        key
    }
}


export {
    createComponent,
    createElement,
    createText,
    createFragment,
}