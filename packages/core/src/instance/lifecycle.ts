import { isArray } from "@crush/common"
import { getCurrentInstance } from "../.."

/*
    those hooks is shared with the component instance and element vnode 
*/
const enum LifecycleHooks {

    BEFORE_CREATE = 'beforeCreate',

    CREATE = 'create',

    // those following hooks is also used for mixins and directives 
    CREATED = 'created',
    BEFORE_MOUNT = 'beforeMount',
    MOUNTED = 'mounted',
    BEFORE_UPDATE = 'beforeUpdate',
    UPDATED = 'updated',
    BEFORE_UNMOUNT = 'beforeUnmount',
    UNMOUNTED = 'unmounted',
}

function injectHook(type: LifecycleHooks, target: any, hook: Function | Function[]) {
    var hooks = (target[type] ||= [])

    if (!isArray(hooks)) {
        target[type] = [target[type]]
    }

    // the input hooks supports array
    if (isArray(hook)) {
        hooks = hooks.concat(hook)
    } else {
        hooks.push(hook)
    }
}

/*
    binding is used for bind the callback context , it is necessary
*/
function callHook(type: LifecycleHooks, target: any, binding: any = null, ...args: any[]) {
    const hooks = target[type]
    if (!hooks) return
    hooks.forEach((hook: Function) => hook.apply(binding, args))
}

const createHook = (type: LifecycleHooks) => (hook: any) => injectHook(type, getCurrentInstance(), hook)

// no beforeCreate
const onCreated = createHook(LifecycleHooks.CREATED)
const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT)
const onMounted = createHook(LifecycleHooks.MOUNTED)
const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE)
const onUpdated = createHook(LifecycleHooks.UPDATED)
const onBeforeUnmount = createHook(LifecycleHooks.BEFORE_UNMOUNT)
const onUnmounted = createHook(LifecycleHooks.UNMOUNTED)

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