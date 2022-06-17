import { processRenderResult } from "@crush/core"
import { patch } from "./patch"


export function mountRenderComponent(vnode: any, container: any, anchor: any) {
    const { type, props, children } = vnode
    const renderResult = type.call(null, props, children)
    const next = processRenderResult(renderResult)
    vnode.vnode = next // 保存当前组件的树
    patch(null, next, container, anchor)
}

export function updateRenderComponent(p: any, n: any, container: any, anchor: any) {
    const { type, props, children } = n
    const renderResult = type.call(null, props, children)
    const next = processRenderResult(renderResult)
    n.vnode = next //
    const prev = p.vnode
    patch(prev, next, container, anchor)
}

export function unmountRenderComponent(vnode: any, container: any, anchor: any) {
    patch(vnode.vnode, null, container, anchor)
}