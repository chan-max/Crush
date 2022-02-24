
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target, key) => hasOwnProperty.call(target, key);

const isReference = (value: any) => typeof value === 'object'

var targetMap = new WeakMap()

const get = Reflect.get
const set = Reflect.set

var shouldTrack = false
var activeEffect = null
function track(target, key) {
    if (!shouldTrack) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let deps: Set<Function> = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect)
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const deps = depsMap.get(key)
    if (!deps) return
    deps.forEach(e => e())
}

var handler = {
    get(target, key, receiver) {
        var value = get(target, key, receiver)
        console.info('get', target, key, value)
        if (hasOwn(target, key)) {
            track(target, key)
        }
        return isReference(value) ? reactive(value) : value
    },
    set(target, key, newValue, receiver) {
        console.info(
            'set',
            target, key, newValue
        )

        var setRes = set(target, key, newValue, receiver)
        trigger(target, key)
        return setRes
    }
}

function reactive(target) {
    return new Proxy(target, handler)
}

function effect(fn) {
    activeEffect = fn
    shouldTrack = true
    fn()
    activeEffect = null
    shouldTrack = false
}

export {
    reactive,
    effect
}