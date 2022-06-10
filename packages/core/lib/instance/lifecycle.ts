
import { emptyObject, isArray } from "@crush/common"
/*
    those hooks is shared with the component instance and element vnode 
*/
const enum LifecycleHooks {


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


function injectMapHooks(target: any, mapHooks: any) {
    for (let type in mapHooks) {
        injectHook(type as LifecycleHooks, target, mapHooks[type])
    }
    return target
}




/*
    binding is used for bind the callback context , it is necessary
*/
function callHook(type: LifecycleHooks, target: any, options: any = null, ...args: any[]): undefined | any[] {
    // hooks is always be array
    const hooks = target[type]
    if (!hooks) return

    var {
        binding,
        scheduler
    } = options || emptyObject

    const hooksResults = hooks.map((hook: any) => {
        return scheduler ? 
        scheduler(hook, binding, ...args) : 
        hook.apply(binding, args)
    })
    // 返回钩子的调用结果
    return hooksResults
}

import { getCurrentInstance } from "@crush/renderer"

const createHook = (type: LifecycleHooks) => (hook: any) => injectHook(type, getCurrentInstance(), hook)

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
    injectMapHooks
}