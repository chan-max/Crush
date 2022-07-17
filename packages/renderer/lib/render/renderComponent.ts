import { effect, LifecycleHooks, processHook, processVnodePrerender } from "@crush/core"
import { patch } from "./patch"


export function mountRenderComponent(vnode: any, container: any, anchor: any, parent: any) {
    const { type, props, children } = vnode

    // 函数式组件没有实例，但也可以拥有状态 , 组件有状态时，会进行自更新 ， 自更新时props和slots内容还是之前传过来的
    function renderComponentUpdate() {
        let isMounted = vnode.isMounted
        const renderResult = type.call(null, props, children, vnode)
        const next = processVnodePrerender(renderResult)
        processHook(isMounted ? LifecycleHooks.BEFORE_UPDATE : LifecycleHooks.BEFORE_MOUNT, vnode)
        patch(vnode.vnode, next, container, anchor, parent)
        processHook(isMounted ? LifecycleHooks.UPDATED : LifecycleHooks.MOUNTED, vnode)
        vnode.vnode = next // 保存当前组件的树
        vnode.isMounted = true
    }

    effect(renderComponentUpdate)
}

export function updateRenderComponent(pVnode: any, nVnode: any, container: any, anchor: any, parent: any) {
    const { type, props, children } = nVnode
    const renderResult = type.call(null, props, children, nVnode, pVnode) // 传入新旧节点
    const next = processVnodePrerender(renderResult)
    const prev = pVnode.vnode
    processHook(LifecycleHooks.BEFORE_UPDATE, nVnode, pVnode)
    patch(prev, next, container, anchor, parent)
    processHook(LifecycleHooks.UPDATED, nVnode, pVnode)
    nVnode.vnode = next //
}

export function unmountRenderComponent(vnode: any, container: any, anchor: any, parent: any) {
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    patch(vnode.vnode, null, container, anchor, parent)
    processHook(LifecycleHooks.UNMOUNTED, vnode)
}