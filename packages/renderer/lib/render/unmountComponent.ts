import { LifecycleHooks, processHook } from '@crush/core'
import { patch } from './patch'

export const unmountComponent = (component: any, container: any, anchor: any = null) => {
    const { instance, props } = component
    const { vnode } = instance
    processHook(LifecycleHooks.BEFORE_UNMOUNT, component)
    // 卸载组件ref
    if (props?.ref) {
        instance.parent.refs[props.ref] = null
    }
    patch(vnode, null, container, anchor, parent)
    processHook(LifecycleHooks.UNMOUNTED, component)
}