import { Nodes } from "@crush/const"
import { processHook, LifecycleHooks, ComponentInstance, isArray } from "@crush/core"

import { updateElementAttributes } from "./attribute"
import { patch } from "./patch"
import { updateComponent } from './updateComponent'

export function update(p: any, n: any, container: any, anchor: any, parent: any) {
    switch (n.nodeType) {
        case Nodes.TEXT:
            updateText(p, n)
            break
        case Nodes.HTML_ELEMENT:
            updateElement(p, n, container, anchor, parent)
            break
        case Nodes.SVG_ELEMENT:
            updateElement(p, n, container, anchor, parent, true)
        case Nodes.STYLE:
            updateStyleSheet(p, n,)
            break
        case Nodes.COMPONENT:
            updateComponent(p, n, container, anchor, parent)
            break
        case Nodes.RENDER_COMPONENT:
            updateRenderComponent(p, n, container, anchor, parent)
            break
        case Nodes.HTML_COMMENT:
            // comment dont update
            break
    }
}


import {
    sortChildren
} from './sequence'
import { updateStyleSheet } from "./updateStyleSheet"
import { updateRenderComponent } from "./renderComponent"

function updateText(p: any, n: any) {
    var el = n.el = p.el
    if (!n.isDynamic) {
        return
    }
    if (p.children !== n.children) {
        el.textContent = n.children
    }
}


function updateElement(p: any, n: any, container: any, anchor: any, parent: ComponentInstance, isSVG = false) {
    const el = n.el = p.el
    processHook(LifecycleHooks.BEFORE_UPDATE, n, p)

    updateElementAttributes(el, p.props, n.props, parent, isSVG, n.dynamicProps)
    processHook(LifecycleHooks.UPDATED, n, p)
    // updated hooks should be called here ? or after children update
    if (n.shouldUpdateChildren) {
        updateChildren(p.children, n.children, container, anchor, parent)
    }
}


export function updateChildren(pChildren: any, nChildren: any, container: any, anchor: any, parent: any) {
    var { p, n } = sortChildren(pChildren, nChildren)
    var max = Math.max(p.length, n.length)
    for (let i = 0; i < max; i++) {
        patch(p[i], n[i], container, getAnchor(p, i + 1), parent)
    }
}

/*
    在已经挂载的vnodes中获取anchor
*/
function getAnchor(vnodes: any, index: number) {
    for (let i = index; i < vnodes.length; i++) {
        let nextSibiling = vnodes[i]
        if (!nextSibiling) {
            // 这里可能出现为空是因为排序时增加的空节点
            continue
        }
        return getLeftEdgeElement(nextSibiling)
    }
}



export function getLeftEdgeElement(vnode: any): any {
    if (!vnode) {
        return null
    }
    switch (vnode.nodeType) {
        case Nodes.COMPONENT:
            return getLeftEdgeElement(vnode.instance.vnode[0])
        case Nodes.RENDER_COMPONENT:
            return getLeftEdgeElement(vnode.vnode[0])
        case Nodes.HTML_ELEMENT:
        case Nodes.SVG_ELEMENT:
        case Nodes.STYLE:
        case Nodes.TEXT:
        case Nodes.HTML_COMMENT:
            return vnode.el
    }
    return null
}


export function getEdgeElements(vnode: any): any {
    if (isArray(vnode)) {
        return vnode.map(getEdgeElements).reduce((res: any, val) => {
            if (!val) {
                return res
            } else if (isArray(val)) {
                res = res.concat(val)
            } else {
                res.push(val)
            }
            return res
        }, [])
    } else if (!vnode) {
        return null
    } else {
        switch (vnode.nodeType) {
            case Nodes.COMPONENT:
                return getEdgeElements(vnode.instance.vnode)
            case Nodes.RENDER_COMPONENT:
                return getEdgeElements(vnode.vnode)
            case Nodes.HTML_ELEMENT:
            case Nodes.SVG_ELEMENT:
            case Nodes.STYLE:
            case Nodes.TEXT:
            case Nodes.HTML_COMMENT:
                return vnode.el
        }
        return null
    }
}