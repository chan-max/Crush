import { LifecycleHooks, processHook } from '@crush/core'
import { patch } from './patch'

export const unmountComponent = (vnode: any, container: any, anchor: any = null) => {
    const { instance, props } = vnode
    
    processHook(LifecycleHooks.BEFORE_UNMOUNT, vnode)
    // 卸载组件ref
    if (props?.ref) {
        instance.parent.refs[props.ref] = null
    }
    patch(instance.vnode, null, container, anchor, parent)
    processHook(LifecycleHooks.UNMOUNTED, vnode)
}