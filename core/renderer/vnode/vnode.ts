import { uid } from "../../common/value"
import { Nodes } from "../../const/node"
import { ComponentType } from "../../instance/component"

export type Vnode = {
    nodeType: Nodes
    type: Symbol | ComponentType | null
    props: any
    children: any
    key: any
}

function createVnode(nodeType: Nodes): Vnode {
    return {
        key: null,
        nodeType,
        type: null,
        props: null,
        children: null
    }
}

function createComponent(type: ComponentType, props: any, slots: any, key: any = uid()): Vnode {
    var component = createVnode(Nodes.COMPONENT)
    component.type = type
    component.props = props
    component.children = slots
    component.key = key
    return component
}


function createText(text: any) {

}

export {
    createComponent
}