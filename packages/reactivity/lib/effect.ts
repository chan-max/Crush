import { emptyObject } from "@crush/common"


export const enum TrackTypes {
    SIZE,
    ADD,
    DELETE,
    ITERATE,
    TARGET_TO_KEY,
    HAS,
    DELETE_PROPERTY,
    OWNKEYS,
    ARRAY_TRIGGER,
    ARRAY_TRACK,

    SET,
    GET,

    CLEAR,

    REF
}

export const TARGET_MAP = new WeakMap()

export function track(type: TrackTypes, target: any, key?: any) {
    let activeEffect = getActiveEffect()
    if (!activeEffect) return
    if (type === TrackTypes.TARGET_TO_KEY) {
        let depsMap = TARGET_MAP.get(target)
        if (!depsMap) {
            depsMap = new Map()
            TARGET_MAP.set(target, depsMap);
        }
        let deps = depsMap.get(key);
        if (!deps) {
            deps = new Set()
            depsMap.set(key, deps);
        }
        deps.add(activeEffect)
        // 用于清除依赖
        activeEffect.deps.push(deps)
    } else {
        debugger
    }
}


export function trigger(type: TrackTypes, target: any, key?: any) {
    if (type === TrackTypes.TARGET_TO_KEY) {
        const depsMap = TARGET_MAP.get(target);
        if (!depsMap) return;
        var deps = depsMap.get(key)
        if (!deps) return
        // 克隆一份，防止死循环
        deps = new Set(deps)
        deps.forEach((effect: any) => effect.triggerRun())
    } else {
        debugger
    }
}


const effectStack: ReactiveEffect[] = []
export const getActiveEffect = () => effectStack[effectStack.length - 1]
export const setActiveEffect = (effect: ReactiveEffect) => effectStack.push(effect)
export const deleteActiveEffect = () => effectStack.pop()

export class ReactiveEffect {

    // 记录副作用依赖了那些变量
    deps: any = []

    effectFn: any

    scheduler: any

    active = false

    constructor(fn: any, scheduler: any) {
        this.effectFn = fn.bind(null)
        this.scheduler = scheduler
    }

    run() {
        this.active = true
        setActiveEffect(this)
        this.cleanDeps()
        const result = this.effectFn()
        deleteActiveEffect()
        return result
    }

    triggerRun() {
        if (this.scheduler) {
            return this.scheduler(this.run.bind(this))
        } else {
            return this.run()
        }
    }

    cleanDeps() {
        this.deps.forEach((deps: any) => {
            deps.delete(this)
        })
        this.deps = []
    }
}

export function createReactiveEffect(fn: any, scheduler?: any) {
    return new ReactiveEffect(fn, scheduler)
}

export const effect = (fn: any, options: any = emptyObject) => {
    var effect = createReactiveEffect(fn, options.scheduler)
    if (!options.lazy) {
        effect.run()
    }
    return effect
}