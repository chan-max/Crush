

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

function injectHook(target: any, type: LifecycleHooks, hook: Function) {
    const hooks = (target[type] ||= [])
    hooks.push(hook)
}

function callHook(target: any, type: LifecycleHooks, ...args: any[]) {
    const hooks = target[type]
    if (!hooks) return
    hooks.forEach((hook: Function) => hook(...args))
}

export {
    LifecycleHooks,
    injectHook,
    callHook
}