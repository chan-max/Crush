import { getCurrentInstance } from "../.."


const enum LifecycleHooks {

    CREATE = 'c',

    CREATED = 'cd',
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u',
    BEFORE_UNMOUNT = 'bum',
    UNMOUNTED = 'um',
}

function injectHook(type: LifecycleHooks, target: any, hook: Function) {
    const hooks = (target[type] ||= [])
    hooks.push(hook)
}

function callHook(type: LifecycleHooks, target: any, ...args: any[]) {
    const hooks = target[type]
    debugger
    if (!hooks) return
    hooks.forEach((hook: Function) => hook(...args))
}

const createHook = (type: LifecycleHooks) => (hook: any) => injectHook(type, getCurrentInstance(), hook)

const onCreated = (hook: any) => createHook(LifecycleHooks.CREATED)
const onBeforeMount = (hook: any) => createHook(LifecycleHooks.BEFORE_MOUNT)
const onMounted = (hook: any) => createHook(LifecycleHooks.MOUNTED)
const onBeforeUpdate = (hook: any) => createHook(LifecycleHooks.BEFORE_UPDATE)
const onUpdated = (hook: any) => createHook(LifecycleHooks.UPDATED)
const onBeforeUnmount = (hook: any) => createHook(LifecycleHooks.BEFORE_UNMOUNT)
const onUnmounted = (hook: any) => createHook(LifecycleHooks.UNMOUNTED)

export {
    LifecycleHooks,
    injectHook,
    callHook,
    onCreated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onMounted,
    onUnmounted,
    onUpdated,
}