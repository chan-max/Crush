import { effect, flatNodes } from "@crush/core"
import { patch } from "./patch"


export function mountRenderComponent(vnode: any, container: any, anchor: any, parent: any) {
    const { type, props, children } = vnode

    // 函数式组件没有实例，但也可以拥有状态 , 组件有状态时，会进行自更新 ， 自更新时props和slots内容还是之前传过来的

    function renderComponentUpdate() {
        const renderResult = type.call(null, props, children)
        const next = flatNodes(renderResult)
        patch(vnode.vnode, next, container, anchor, parent)
        vnode.vnode = next // 保存当前组件的树
    }

    effect(renderComponentUpdate)
}

export function updateRenderComponent(p: any, n: any, container: any, anchor: any, parent: any) {
    const { type, props, children } = n
    const renderResult = type.call(null, props, children)
    const next = flatNodes(renderResult)
    n.vnode = next //
    const prev = p.vnode
    patch(prev, next, container, anchor, parent)
}

export function unmountRenderComponent(vnode: any, container: any, anchor: any, parent: any) {
    patch(vnode.vnode, null, container, anchor, parent)
}