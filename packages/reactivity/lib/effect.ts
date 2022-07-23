import { emptyObject, isUndefined } from "@crush/common"
import { ReactiveFlags } from "./common"


export const TARGET_MAP = new WeakMap()

export function getDepsMap(target: any) {

    let depsMap = TARGET_MAP.get(target)
    if (!depsMap) {
        depsMap = new Map()
        TARGET_MAP.set(target, depsMap);
    }
    return depsMap
}

export function getDeps(target: any, key?: any) {
    // ref 和 set类型 没有depsMap ，只有 deps
    if (!isUndefined(key)) { // 没传 key
        let depsMap = getDepsMap(target)
        let deps = depsMap.get(key);
        if (!deps) {
            deps = new Set()
            depsMap.set(key, deps);
        }
        return deps
    } else {
        let deps = TARGET_MAP.get(target)
        if (!deps) {
            deps = new Set()
            TARGET_MAP.set(target, deps)
        }
        return deps
    }
}


export function track(target: any, key?: any) {
    let activeEffect = getActiveEffect()
    if (!activeEffect) return
    let deps = getDeps(target, key)
    deps.add(activeEffect)
    // 用于清除依赖
    activeEffect.deps.push(deps)
}


/* 特殊的target key ，当target任意key改变时，此依赖也会触发 */
export const targetObserverSymbol = Symbol('target has changed')


export function trackTargetObserver(target: any) {
    track(target, targetObserverSymbol)
}

export function triggerTargetObserver(target: any) {
    trigger(target, targetObserverSymbol)
}

export function trigger(target: any, key?: any) {
    // trigger 中会触发target中的依赖
    if (isUndefined(key)) {
        let deps = getDeps(target)
        // 无depsmap
        runDeps(deps)
    } else {
        // 任一key内容改变都会触发这一依赖
        if (key !== targetObserverSymbol) { // 防止递归死循环
            triggerTargetObserver(target)
        }
        triggerTargetKey(target, key)
    }
}


export function triggerAllDepsMap(target: any) {
    let depsMap = getDepsMap(target)
    for (let [key, deps] of depsMap) {
        runDeps(deps)
    }
}


export function triggerTargetKey(target: any, key: any) {
    let deps = getDeps(target, key);
    // copy 防止死循环
    runDeps(deps)
}


function runDeps(deps: any) {
    [...deps].forEach((dep: any) => {
        if (isEffect(dep)) {
            if (dep == getActiveEffect()) {
                return
            }
            dep.triggerRun()
        } else {
            dep()
        }
    })
}

//! effect


const effectStack: ReactiveEffect[] = []
export const getActiveEffect = () => effectStack[effectStack.length - 1]
export const setActiveEffect = (effect: ReactiveEffect) => effectStack.push(effect)
export const deleteActiveEffect = () => effectStack.pop()

export function isEffect(value: any) {
    return value && value[ReactiveFlags.IS_EFFECT]
}

export class ReactiveEffect {

    [ReactiveFlags.IS_EFFECT] = true

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