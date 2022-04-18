


const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target: Record<any, any>, key: any) => hasOwnProperty.call(target, key);

const isReference = (value: any) => typeof value === 'object'

var targetMap = new WeakMap()

const get = Reflect.get
const set = Reflect.set

var shouldTrack = false
var activeEffect: any = null

function track(target: any, key: any) {
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

function trigger(target: any, key: any) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const deps = depsMap.get(key)
    if (!deps) return
    deps.forEach((e: any) => {
        var scheduler = e.options.scheduler
        if(scheduler){
            scheduler(e)
        }else{
            e()
        }
    })
}

var handler = {
    get(target: any, key: any, receiver: any) {
        var value = get(target, key, receiver)
        console.warn('get', target, key, value)
        if (hasOwn(target, key)) {
            track(target, key)
        }
        return isReference(value) ? reactive(value) : value
    },
    set(target: any, key: any, newValue: any, receiver: any) {
        console.warn(
            'set',
            target, key, newValue
        )

        var setRes = set(target, key, newValue, receiver)
        trigger(target, key)
        return setRes
    }
}

function reactive(target: any): any {
    return new Proxy(target, handler)
}

function effect(fn: any, options = {}) {

    var effectFn: any = () => {
        fn()
    }
    effectFn.options = options

    activeEffect = effectFn
    shouldTrack = true
    effectFn()
    activeEffect = null
    shouldTrack = false
}


export {
    reactive,
    effect
}