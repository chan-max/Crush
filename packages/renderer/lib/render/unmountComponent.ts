import { LifecycleHooks, processHook } from '@crush/core'
import { patch } from './patch'

export const unmountComponent = (component: any, container: any, anchor: any = null) => {
    const { instance } = component
    const { vnode } = instance
    processHook(LifecycleHooks.BEFORE_UNMOUNT, component)
    patch(vnode, null, container, anchor)
    processHook(LifecycleHooks.UNMOUNTED, component)
}