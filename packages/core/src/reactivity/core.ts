
var activeEffect: any = null
var shouldTrack = false
var effectStack: any[] = []

var targetMap = new WeakMap()

class ReactiveEffect {

    fn: any = null

    deps = []

    scheduler = null

    constructor(fn: any, options: any) {
        this.fn = fn
        this.scheduler = options.scheduler
    }

    cleanDeps() {
        this.deps.forEach((deps: any) => {
            deps.delete(this)
        })
        this.deps = []
    }

    run() {
        effectStack.push(this)
        activeEffect = this
        shouldTrack = true
        this.cleanDeps()
        var res = this.fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
}

function effect(fn: any, options: any = {}) {
    var _effect = new ReactiveEffect(fn, options)
    if (!options.lazy) {
        _effect.run()
    }
    return _effect
}

function track(target: any, key: any) {
    if (!shouldTrack) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap);
    }
    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps);
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}


function trigger(target: any, key: any) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    var deps = depsMap.get(key)
    if (!deps) return
    // 克隆一份，防止死循环
    deps = new Set(deps)
    deps.forEach((e: any) => {
        if (e === activeEffect) return
        if (e.scheduler) {
            e.scheduler(e)
        } else {
            e.run()
        }
    })
}

var handler = {
    get(target: any, key: any) {
        console.log('get');
        track(target, key)
        return target[key]
    },
    set(target: any, key: any, newValue: any) {
        console.log('set');
        trigger(target, key)
        target[key] = newValue
        return true
    }
}

function reactive(target: any) {
    return new Proxy(target, handler)
}

function computed(getter: any) {
    var value: any
    var dirty = true
    var _effect = effect(getter, {
        scheduler: () => {
            if (!dirty) {
                dirty = true
                track(res, 'value')
            }
        },
        lazy: true
    })
    var res = {
        get value() {
            return dirty ? _effect.run() : value
        }
    }
    return res
}

function watch(visitor: Function, callback: Function) {
    effect(visitor, {
        scheduler: () => {
            callback()
        }
    })
}

export {
    reactive,
    effect,
    computed,
    watch
}