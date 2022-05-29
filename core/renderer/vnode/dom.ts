import { uid } from "../../common/value"
import { Nodes } from "../../const/node"
import { ComponentType } from "../../instance/component"

export type Vnode = {
    nodeType: Nodes
    type: any
    props: any
    children: any
    key: any
}

function createNode(nodeType: Nodes): any{
    return {
        key: null,
        nodeType,
        type: null,
        props: null,
        children: null
    }
}

function createComponent(type: ComponentType, props: any, slots: any, key: any = uid()): Vnode {
    var component = createNode(Nodes.COMPONENT)
    component.type = type
    component.props = props
    component.children = slots
    component.key = key
    return component
}

function createElement(tagName: string, props: any, children: any, key: any = uid()) {
    var node = createNode(Nodes.HTML_ELEMENT)
    node.type = tagName
    node.props = props
    node.children = children
    node.key = key
    return node
}

function createSVGElement() {

}



const SYMBOL_TEXT = Symbol('Text')
const SYMBOL_COMMENT = Symbol('Comment')
// the key is for other node
function createText(text: any, key = uid()) {
    var node = createNode(Nodes.TEXT)
    node.type = SYMBOL_TEXT
    node.children = text
    node.key = key
    return node
}

function createFragment(children: any, key = uid()) {
    const f = createNode(Nodes.FRAGMENT)
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