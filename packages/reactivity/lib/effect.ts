import { emptyObject } from "@crush/common"
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

export function getDeps(target: any, key: any) {
    let depsMap = getDepsMap(target)
    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps);
    }
    return deps
}

export function track(target: any, key?: any) {
    let activeEffect = getActiveEffect()
    if (!activeEffect) return
    let deps = getDeps(target, key)
    deps.add(activeEffect)
    // 用于清除依赖
    activeEffect.deps.push(deps)
}


export const targetChangeCollectSymbol = Symbol('target has changed')

export function trigger(target: any, key: any) {

    if (key !== targetChangeCollectSymbol) {
        // 防止递归
        trigger(target, targetChangeCollectSymbol)
    }

    let deps = getDeps(target, key)
    deps.forEach((dep: any) => {
        if (isEffect(dep)) {
            dep.triggerRun()
        } else {
            dep()
        }
    })
}


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