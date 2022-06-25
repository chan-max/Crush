import { isFunction, isObject, mark, uid } from "@crush/common"
import { Nodes } from "@crush/const"
import { ComponentType, resolveOptions } from "@crush/core"

export type Vnode = {
    nodeType: Nodes
    type: any
    props: any
    children: any
    key: any
}

function createNode(nodeType: Nodes): any {
    return {
        key: null,
        nodeType,
        type: null,
        props: null,
        children: null
    }
}



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

function createElement(tagName: string, props: any, children: any, key: any = uid()) {
    var node = createNode(Nodes.HTML_ELEMENT)
    node.type = tagName
    node.props = props
    node.children = children
    node.key = key
    return node
}

export function createSVGElement(tagName: string, props: any, children: any, key: any = uid()) {
    var node = createNode(Nodes.SVG_ELEMENT)
    node.type = tagName
    node.props = props
    node.children = children
    node.key = key
    return node
}



export const Text = Symbol('Text')

// the key is for other node
function createText(text: any, key = uid()) {
    var node = createNode(Nodes.TEXT)
    node.type = Text
    node.children = text
    node.key = key
    return node
}

export const Comment = Symbol('Comment')
export function createComment(text: any, key = uid()) {
    return {
        type: Comment,
        nodeType: Nodes.HTML_COMMENT,
        children:text,
         key
    }
}

const Fragment = Symbol('Fragment')
function createFragment(children: any, key = uid()) {
    const f = createNode(Nodes.FRAGMENT)
    f.type = Fragment
    f.children = children
    f.key = key
    return f
}


export {
    createComponent,
    createElement,
    createText,
    createFragment,
    createNode
}