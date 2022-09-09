import { emptyObject, isArray, LifecycleHooks, processHook, removeElement } from '@crush/core'
import { patch } from './patch'
import { getKeepAliveOptions, unmountComponentIfKeepAlive } from './renderKeepAlive'




export const unmountComponent = (vnode: any, container: any = null, anchor: any = null) => {

    if (unmountComponentIfKeepAlive(vnode)) {
        return
    }

    // 卸载流程

    const { instance, props } = vnode
    
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)

    // 卸载组件ref
    props?.ref && (instance.parent.refs[props.ref] = null)

    patch(instance.vnode, null, container, anchor, parent)
    processHook(LifecycleHooks.UNMOUNTED, vnode)
}