import { processHook } from "../../instance/directive";
import { callHook, LifecycleHooks } from "../../instance/lifecycle";
import { Nodes } from "../../node/nodes";
import { nodeOps } from './nodeOps'
import { unmountComponent } from "./unmountComponent";

export function unmount(vnode: any, container: any, anchor: any) {
    switch (vnode.type) {
        case Nodes.HTML_ELEMENT:
            unmountElement(vnode)
            break
        case Nodes.TEXT:
            nodeOps.remove(vnode.ref)
            break
        case Nodes.COMPONENT:
            unmountComponent(vnode, container, anchor)
            break
    }
}

export function unmountChildren(children: any) {
    // 卸载过程目前不需要锚点
    children.forEach(unmount);
}

function unmountElement(vnode: any) {
    if (vnode.children) {
        unmountChildren(vnode.children)
    }
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode, null)
    nodeOps.remove(vnode.ref)
    processHook(LifecycleHooks.UNMOUNTED, vnode, null)
}