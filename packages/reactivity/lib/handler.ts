import { isArray, isFunction, hasOwn, warn } from "@crush/common"
import { ReactiveFlags, ReactiveTypes, ReactiveTypeSymbol, toRaw } from "./common"
import { reactive, readonly } from "./reactive"

import { track, trackTargetObserver, trigger, triggerAllDepsMap, } from './effect'

//  保留则最近一次访问的信息
let lastVisitedTargetIsReadonly = false
let lastVisitedTargetIsShallow = false
let lastVisitedTarget: any
let lastVisitedKey: any

export const getLastvisitedTarget = () => lastVisitedTarget
export const getLastvisitedKey = () => lastVisitedKey

function pushGetterState(isReadonly: any, isShallow: any, target: any, key: any) {
    lastVisitedKey = key
    lastVisitedTarget = target
    lastVisitedTargetIsReadonly = isReadonly
    lastVisitedTargetIsShallow = isShallow
}



// set state

let _lastSetTarget: any
let _lastSetKey: any
let _lastSetOldValue: any
let _lastSetNewValue: any

export const getLastSetTarget = () => _lastSetTarget // 获取上一个修改的目标
export const getLastSetKey = () => _lastSetKey // 获取上一个修改的key
export const getLastSetOldValue = () => _lastSetOldValue // 获取上一个修改前的旧值
export const getLastSetNewValue = () => _lastSetNewValue // 获取上一个修改后的新值



const collectionHandlers: Record<string, any> = {
    get size() {
        //  set , map  size 收集后 ， 只有目标的size变化后才会触发依赖
        //todo bug 任一元素变化后 都会触发该依赖
        trackTargetObserver(lastVisitedTarget)
        return lastVisitedTarget.size
    },
    // set weakset
    add(value: any) {
        if (lastVisitedTargetIsReadonly) {
            return
        }
        var result = lastVisitedTarget.add(value)
        trigger(lastVisitedTarget, value)
        // 返回set对象本身
        return result
    },
    // map set
    clear() {
        if (lastVisitedTargetIsReadonly) {
            return
        }
        // 触发所有依赖
        lastVisitedTarget.clear()
        triggerAllDepsMap(lastVisitedTarget)
    },
    // map weakmap set weakset
    delete(key: any) {
        if (lastVisitedTargetIsReadonly) {
            return
        }
        const result = lastVisitedTarget.delete(key)
        if (result) { // 返回为 true 为删除成功
            trigger(lastVisitedTarget, key)
        }
        return result
    },
    // map set
    entries() {
        trackTargetObserver(lastVisitedTarget)
        return lastVisitedTarget.entries()
    },
    // map set
    forEach(fn: any) {
        trackTargetObserver(lastVisitedTarget)
        return lastVisitedTarget.forEach(fn)
    },
    // set map weakset weakmap
    has(key: any) {
        track(lastVisitedTarget, key)
        return lastVisitedTarget.has(key)
    },
    // map set
    keys() {
        trackTargetObserver(lastVisitedTarget)
        return lastVisitedTarget.keys()
    },
    // map set
    values() {
        trackTargetObserver(lastVisitedTarget)
        return lastVisitedTarget.values()
    },
    // map weakmap
    set(key: any, value: any) {
        if (lastVisitedTargetIsReadonly) {
            return
        }
        var result = lastVisitedTarget.set(key, value)
        trigger(lastVisitedTarget, key)
        return result
    },
    // map weakmap
    get(key: any) {
        if (!lastVisitedTargetIsReadonly) {
            track(lastVisitedTarget, key)
        }
        var value = lastVisitedTarget.get(key)
        return lastVisitedTargetIsShallow ? value : reactive(value)
    }
}


function createArrayHandlerWithTrack(method: any) {
    return function (this: any, ...args: any) {
        let array = this[ReactiveFlags.RAW]
        let result = array[method](...args)
        return result
    }
}

function createArrayHandlerWithTrigger(method: any) {
    return function (this: any, ...args: any) {
        let array = this[ReactiveFlags.RAW]
        let oldKeys = Object.keys(array)
        let result = array[method](...args);
        [...oldKeys, 'length'].forEach((key: any) => trigger(array, key))
        return result
    }
}

const normalizeHandlers: Record<string, any> = {
    // should track
    includes: createArrayHandlerWithTrack('includes'),
    indexOf: createArrayHandlerWithTrack('indexOf'),
    lastIndexOf: createArrayHandlerWithTrack('lastIndexOf'),
    // should trigger
    push: createArrayHandlerWithTrigger('push'),
    pop: createArrayHandlerWithTrigger('pop'),
    shift: createArrayHandlerWithTrigger('shift'),
    unshift: createArrayHandlerWithTrigger('unshift'),
    splice: createArrayHandlerWithTrigger('splice')
};


const specialKeyHandler: Record<string, any> = {
    [Symbol.iterator]: (value: Function) => {
        // should track
        trackTargetObserver(lastVisitedTarget)
        return value.bind(lastVisitedTarget)
    }
}


// 可用于收集依赖的key
const isProxyKey = (target: any, key: any) => !(key in target) || hasOwn(target, key)

function createGetter(isReadonly: boolean, isShallow: boolean, isCollection: boolean) {

    function baseGetter(target: any, key: any, receiver: any) {
        // reserved keys
        switch (key) {
            case ReactiveFlags.RAW:
                return target
            case ReactiveFlags.IS_REACTIVE:
                return !isReadonly
            case ReactiveFlags.IS_SHALLOW:
                return isShallow
            case ReactiveFlags.IS_READONLY:
                return isReadonly
            case ReactiveTypeSymbol:
                // 所欲响应式数据都会有此标记
                return true
        }
        // 保留的key值不会存入访问信息
        pushGetterState(isReadonly, isShallow, target, key)

        if (isCollection) {
            // collection methods reset
            if (hasOwn(collectionHandlers, key) && key in target) {
                return collectionHandlers[key]
            }
        } else if (isProxyKey(target, key)) {
            //  可收集属性， 是自身属性时才会收集 , readonly 不会收集
            if (!isReadonly) {
                track(target, key)
            }
            var value = Reflect.get(target, key, receiver)

            if (isShallow) {
                //! readonly 和 shallowreadonly 都不会收集 , 直接返回原始值
                return value
            }

            return isReadonly ? readonly(value) : reactive(value)

        } else if (isArray(target) && hasOwn(normalizeHandlers, key)) {
            // 数组重写方法
            return normalizeHandlers[key]
        }

        var value = Reflect.get(target, key, receiver)

        // 特殊key处理器
        if (hasOwn(specialKeyHandler, key)) {
            value = specialKeyHandler[key](value)
        }

        return value
    }

    return baseGetter
}


export const onSetCallbacks = new Set()
// 注册一个回调函数，当响应式的值改变后触发回掉 => 参数 ： target，key ， newValue ， oldValue
export function onSet(cb: any) {
    onSetCallbacks.add(cb)
    return () => onSetCallbacks.delete(cb)
}

export function createSetter(isReadonly: boolean = false, isShallow: boolean = false) {
    return (target: any, key: any, newValue: any, receiver: any) => {
        // 返回 false 时会报错
        if (isReadonly) {
            warn(`${target} is readonly`)
            return true
        }
        if (isProxyKey(target, key)) {
            // 不允许设置非自身属性

            let oldValue = Reflect.get(target, key, receiver)

            _lastSetTarget = target
            _lastSetKey = key

            /* 当旧值是一个对象，但变成了基本类型后，则视为一次解绑 */
            _lastSetOldValue = oldValue

            _lastSetNewValue = newValue

            onSetCallbacks.forEach((cb: any) => cb(target, key, newValue, oldValue))

            Reflect.set(target, key, newValue, receiver)
            trigger(target, key)
        }
        return true
    }
}

function has(target: any, key: any) {
    /*
        has 包括非自身的key 
        ? in target
    */
    if (hasOwn(target, key)) {
        // has 的收集 ， 只有在key删除时才会触发 
        //! bug 使用 with 访问值时会先进入has 在进入get
        track(target, key)
    }
    return Reflect.has(target, key);
}

function ownKeys(target: any) {
    /*
        for ? in target
    */
    // Object.assign will call this

    return Reflect.ownKeys(target);
}

function deleteProperty(target: any, key: any) {
    // 为 true 表示删除成功
    const isOwn = hasOwn(target, key)
    const result = Reflect.deleteProperty(target, key);
    if (result && isOwn) {
        trigger(target, key)
    }
    return result;
}

function readonlyDeleteProperty(target: any, key: any) {
    warn(`${key} in `, target, ` can't delete`)
    return true
}


// object handlers
export const reactiveHandler: any = {
    get: createGetter(false, false, false),
    set: createSetter(false, false),
    ownKeys,
    deleteProperty,
    has
}

export const shallowReactiveHandler: any = {
    get: createGetter(false, true, false),
    set: createSetter(false, true),
    ownKeys,
    deleteProperty,
    has
}

export const readonlyHandler: any = {
    get: createGetter(true, false, false),
    set: createSetter(true, false),
    deleteProperty: readonlyDeleteProperty
}

export const shallowReadonlyHandler: any = {
    get: createGetter(true, true, false),
    set: createSetter(true, true),
    deleteProperty: readonlyDeleteProperty
}

// collection handlers

export const reactiveCollectionHandler = {
    get: createGetter(false, false, true)
}

export const readonlyCollectionHandler = {
    get: createGetter(true, false, true)
}

export const shallowReactiveCollectionHandler = {
    get: createGetter(false, true, true)
}

export const shallowReadonlyCollectionHandler = {
    get: createGetter(true, true, true)
}


/*
    todo
    shallowReactiveDeepReadonly
    shallowReadonlyDeepReactive
*/