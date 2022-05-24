import { removeFromArray } from "@crush/common";
import { Nodes } from "../../node/nodes";
import { patch } from "./patch";
import { updateStyleSheet } from "./updateStyleSheet";
import { updateComponent } from "./updateComponent";

export function update(p: any, n: any, container: any, anchor: any) {
    switch (n.type) {
        case Nodes.TEXT:
            updateText(p, n)
            break
        case Nodes.HTML_ELEMENT:
            updateHTMLElement(p, n, container, anchor)
            break
        case Nodes.COMPONENT:
            updateComponent(p, n, container, anchor)
            break
        case Nodes.STYLE:
            updateStyleSheet(p, n)
            break
    }
}

import {
    diffChildren
} from './sequence'

function updateText(p: any, n: any) {
    var ref = n.ref = p.ref
    if (p.children !== n.children) {
        ref.textContent = n.children
    }
}

import {
    updateProps
} from './props'
import { callHook, LifecycleHooks } from "../../instance/lifecycle";
import { callElementHook } from "../../instance/directive";

function updateHTMLElement(p: any, n: any, container: any, anchor: any) {

    var el = n.ref = p.ref


    /* think ?
        存在html元素节点上的钩子一定是指令吗？
        <input  b >
    */

    // 更新钩子仅针对元素与子节点无关
    callElementHook(LifecycleHooks.BEFORE_UPDATE, p, n)
    updateProps(p.props, n.props, el, n)
    callElementHook(LifecycleHooks.UPDATED, p, n)

    // updated hooks should be called here ? or after children update
    updateChildren(p.children, n.children, container, anchor)

}


export function updateChildren(pChildren: any, nChildren: any, container: any, anchor: any) {
    var {
        p, n
    } = diffChildren(pChildren, nChildren, false)

    var max = Math.max(p.length, n.length)
    for (let i = 0; i < max; i++) {
        patch(p[i], n[i], container, getAnchor(p, i + 1))
    }
}

/*
    在已经挂载的vnodes中获取anchor
*/
function getAnchor(vnodes: any, index: number) {
    for (let i = index; i < vnodes.length; i++) {
        var ref = vnodes[i]?.ref
        if (ref) {
            return ref
        }
    }
}


