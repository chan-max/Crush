import { Vnode } from "../vnode/vnode";
import { Nodes } from "../../const/node";
import { mountComponent } from "./mountComponent";
import {
    nodeOps
} from './nodeOps'
import { mountAttributes } from "./attribute"

export function mount(vnode: Vnode, container: any, anchor: any = null) {
    switch (vnode.nodeType) {
        case Nodes.HTML_ELEMENT:
            mountHTMLElement(vnode, container, anchor)
            break
        case Nodes.TEXT:
            mountText(vnode, container, anchor)
            break
        case Nodes.COMPONENT:
            mountComponent(vnode, container, anchor)
            break
        case Nodes.STYLE:
            // mountStyleSheet(vnode, container)
            break
    }
}

export function mountChildren(children: any, container: any, anchor: any) {
    children.forEach((child: any) => {
        mount(child, container, anchor)
    });
}

function mountHTMLElement(vnode: any, container: any, anchor: any) {
    const { type, props, children } = vnode

    // create 
    var el = nodeOps.createElement(type)
    vnode.ref = el
    mountAttributes(el, props)
    
    nodeOps.insert(el, container, anchor)
    if (children) {
        mountChildren(children, el, anchor)
    }
}

function mountText(vnode: any, container: any, anchor: any) {
    var el = nodeOps.createText(vnode.children)
    vnode.ref = el
    nodeOps.insert(el, container, anchor)
}