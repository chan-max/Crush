import { isArray, isFunction, hasOwn, warn } from "@crush/common"
import { ReactiveFlags, ReactiveTypes, ReactiveTypeSymbol, toRaw } from "./common"
import { reactive, readonly } from "./reactive"

import { track, trackTargetObserver, trigger, triggerAllDepsMap, triggerTargetObserver, } from './effect'

// global state
let _isReadonly = false
let _isShallow = false
let _target: any
let _key: any

export const getLastVisitTarget = () => _target
export const getLastVisitKey = () => _key

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
        trackTargetObserver(_target)
        return _target.size
    },
    // set weakset
    add(value: any) {
        if (_isReadonly) {
            return
        }
        var result = _target.add(value)
        trigger(_target, value)
        // 返回set对象本身
        return result
    },
    // map set
    clear() {
        if (_isReadonly) {
            return
        }
        // 触发所有依赖
        _target.clear()
        triggerAllDepsMap(_target)
    },
    // map weakmap set weakset
    delete(key: any) {
        if (_isReadonly) {
            return
        }
        const result = _target.delete(key)
        if (result) { // 返回为 true 为删除成功
            trigger(_target, key)
        }
        return result
    },
    // map set
    entries() {
        trackTargetObserver(_target)
        return _target.entries()
    },
    // map set
    forEach(fn: any) {
        trackTargetObserver(_target)
        return _target.forEach(fn)
    },
    // set map weakset weakmap
    has(key: any) {
        track(_target, key)
        return _target.has(key)
    },
    // map set
    keys() {
        trackTargetObserver(_target)
        return _target.keys()
    },
    // map set
    values() {
        trackTargetObserver(_target)
        return _target.values()
    },
    // map weakmap
    set(key: any, value: any) {
        if (_isReadonly) {
            return
        }
        var result = _target.set(key, value)
        trigger(_target, key)
        return result
    },
    // map weakmap
    get(key: any) {
        if (!_isReadonly) {
            track(_target, key)
        }
        var value = _target.get(key)
        return _isShallow ? value : reactive(value)
    }
}


function normalizeHandlerWithTrack(...args: any[]) {
    if (!_isReadonly) { // 非只读才会收集

    }

    let result = _target[_key](...args)
    return result
}

function normalizeHandlerWithTrigger(...args: any[]) {
    if (_isReadonly) {
        // 只读不能修改
        return
    }
    // 用数组修改前的key作为触发依赖
    let oldKeys = Object.keys(_target)
    let result = _target[_key](...args);
    [...oldKeys, 'length'].forEach((key: any) => trigger(_target, key))
    return result
}

const normalizeHandlers: Record<string, any> = {
    // should track
    includes: normalizeHandlerWithTrack,
    indexOf: normalizeHandlerWithTrack,
    lastIndexOf: normalizeHandlerWithTrack,
    // should trigger
    push: normalizeHandlerWithTrigger,
    pop: normalizeHandlerWithTrigger,
    shift: normalizeHandlerWithTrigger,
    unshift: normalizeHandlerWithTrigger,
    splice: normalizeHandlerWithTrigger
};


const specialKeyHandler: Record<string, any> = {
    [Symbol.iterator]: (value: Function) => {
        // should track ?

        return value.bind(_target)
    }
}


// 可用于收集依赖的key
const isProxyKey = (target: any, key: any) => !(key in target) || hasOwn(target, key)

function createGetter(isReadonly: boolean, isShallow: boolean, isCollection: boolean) {
    return (target: any, key: any, receiver: any) => {
        // cache global state
        _isReadonly = isReadonly
        _isShallow = isShallow
        _target = target
        _key = key
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

        if (isCollection) {
            // collection methods reset
            if (hasOwn(collectionHandlers, key) && key in target) {
                return collectionHandlers[key]
            }
        } else if (isProxyKey(target, key)) {
            // !  可收集属性， 是自身属性时才会收集 , readonly 不会收集
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