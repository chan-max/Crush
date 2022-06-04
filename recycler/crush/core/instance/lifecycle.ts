

const enum LifecycleHooks {
    BEFORE_CREATE = 'bc',
    CREATED = 'c',
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u',
    BEFORE_UNMOUNT = 'bum',
    UNMOUNTED = 'um',
}

function injectHook(target, type, hook: Function) {
    const hooks = (target[type] ||= [])
    hooks.push(hook)
}

function callHook(target, type, ...args) {
    const hooks = target[type]
    if (!hooks) return
    hooks.forEach((hook) => hook(...args))
}

export {
    LifecycleHooks,
    injectHook,
    callHook
}