import { removeFromArray } from "@crush/common";
import { Nodes } from "../../node/nodes";
import { patch } from "./patch";
import { updateStyleSheet } from "./updateStyleSheet";

export function update(p: any, n: any, container: any, anchor: any) {
    switch (n.type) {
        case Nodes.TEXT:
            var ref = n.ref = p.ref
            if (p.children !== n.children) {
                ref.textContent = n.children
            }
            break
        case Nodes.HTML_ELEMENT:
            updateHTMLElement(p, n, container, anchor)
            break
        case Nodes.STYLE:
            updateStyleSheet(p, n)
            break
    }
}

import {
    diffChildren
} from './sequence'


import {
    updateProps
} from './props'
import { callHook, LifecycleHooks } from "../../instance/lifecycle";

function updateHTMLElement(p: any, n: any, container: any, anchor: any) {

    var el = n.ref = p.ref

    /* key相同时，会作为更新操作，key不同时，会视为一次卸载和挂载*/
    var samePatchKey = p.patchKey === n.patchKey

    if (samePatchKey) {
        // 相同节点，钩子函数一定相同
        callHook(LifecycleHooks.BEFORE_UPDATE, n, null, el)
    } else {
        callHook(LifecycleHooks.BEFORE_UNMOUNT, p, null, el)
        callHook(LifecycleHooks.BEFORE_MOUNT, p, null, el)
    }

    updateProps(p.props, n.props, el, n)
    // updated hooks should be called here ? or after children update
    updateChildren(p.children, n.children, container, anchor)

    if (samePatchKey) {
        // 相同节点，钩子函数一定相同
        callHook(LifecycleHooks.UPDATED, n, null, el)
    } else {
        callHook(LifecycleHooks.UNMOUNTED, p, null, el)
        callHook(LifecycleHooks.MOUNTED, p, null, el)
    }
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


