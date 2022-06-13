import { isArray, isFunction, hasOwn, warn } from "@crush/common"
import { ReactiveFlags, ReactiveTypes, ReactiveTypeSymbol, toRaw } from "./common"
import { reactive, readonly } from "./reactive"

import { TrackTypes, track, trigger, } from './effect'

// global state
let _isReadonly = false
let _isShallow = false
let _target: any
let _key: any

export const getLastVisitTarget = () => _target
export const getLastVisitKey = () => _key

const collectionHandlers: Record<string, any> = {
    get size() {
        //  set , map  size 收集后 ， 只有目标的size变化后才会触发依赖
        track(TrackTypes.SIZE, _target)
        return _target.size
    },
    // set weakset
    add(value: any) {
        if (_isReadonly) {
            return warn(_target, 'is readonly , cant add');
        }
        var result = _target.add(value)
        trigger(TrackTypes.ADD, _target)
        // 返回set对象本身
        return result
    },
    // map set
    clear() {
        if (_isReadonly) {
            return warn(_target, 'is readonly cant clear');
        }
        _target.clear()
        trigger(TrackTypes.CLEAR, _target)
    },
    // map weakmap set weakset
    delete(key: any) {
        if (_isReadonly) {
            return warn(_target, 'is readonly cant delete');
        }
        const result = _target.delete(key)
        if (result) { // 返回为 true 为删除成功
            trigger(TrackTypes.DELETE, _target, key)
        }
        return result
    },
    // map set
    entries() {
        track(TrackTypes.ITERATE, _target)
        return _target.entries()
    },
    // map set
    forEach(fn: any) {
        track(TrackTypes.ITERATE, _target)
        return _target.forEach(fn)
    },
    // set map weakset weakmap
    has(key: any) {
        track(TrackTypes.HAS, _target, key)
        return _target.has(key)
    },
    // map set
    keys() {
        track(TrackTypes.ITERATE, _target)
        return _target.keys()
    },
    // map set
    values() {
        track(TrackTypes.ITERATE, _target)
        return _target.values()
    },
    // map weakmap
    set(key: any, value: any) {
        if (_isReadonly) {
            return warn(_target, 'is readonly , cant set');
        }
        var result = _target.set(key, value)
        trigger(TrackTypes.SET, _target, key)
        return result
    },
    // map weakmap
    get(key: any) {
        if (!_isReadonly) {
            track(TrackTypes.GET, _target, key)
        }
        var value = _target.get(key)
        return _isShallow ? value : reactive(value)
    }
}


function arrayHandlerWithTrack(...args: any[]) {
    if (!_isReadonly) { // 非只读才会收集
        trigger(TrackTypes.ARRAY_TRACK, _target)
    }
    let result = _target[_key](...args)
    return result
}

function arrayHandlerWithTrigger(...args: any[]) {
    if (_isReadonly) {
        return warn(`${_target}is readonly cant ${_key}`);
    }
    let result = _target[_key](...args)
    trigger(TrackTypes.ARRAY_TRIGGER, _target)
    return result
}

const arrayHandlers: Record<string, any> = {
    // should track
    includes: arrayHandlerWithTrack,
    indexOf: arrayHandlerWithTrack,
    lastIndexOf: arrayHandlerWithTrack,
    // should trigger
    push: arrayHandlerWithTrigger,
    pop: arrayHandlerWithTrigger,
    shift: arrayHandlerWithTrigger,
    unshift: arrayHandlerWithTrigger,
    splice: arrayHandlerWithTrigger
};

const SYMBOL_ITERATOR = Symbol.iterator

const specialKeyHandler: Record<string, any> = {
    [SYMBOL_ITERATOR]: (value: Function) => {
        // should track ?
        track(TrackTypes.ITERATE, _target)
        return value.bind(_target)
    }
}

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
                track(TrackTypes.TARGET_TO_KEY, target, key)
            }
            var value = Reflect.get(target, key, receiver)

            if (isShallow) {
                //! readonly 和 shallowreadonly 都不会收集 , 直接返回原始值
                return value
            }

            return isReadonly ? readonly(value) : reactive(value)

        } else if (isArray(target) && hasOwn(arrayHandlers, key)) {
            // 数组重写方法
            return arrayHandlers[key]
        }

        var value = Reflect.get(target, key, receiver)

        // 特殊key处理器
        if (hasOwn(specialKeyHandler, key)) {
            value = specialKeyHandler[key](value)
        }

        return value
    }
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
            Reflect.set(target, key, newValue, receiver)
            trigger(TrackTypes.TARGET_TO_KEY, target, key)
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
        track(TrackTypes.TARGET_TO_KEY, target, key)
    }
    return Reflect.has(target, key);
}

function ownKeys(target: any) {
    /*
        for ? in target
    */
    track(TrackTypes.ITERATE, target)
    return Reflect.ownKeys(target);
}

function deleteProperty(target: any, key: any) {
    // 为 true 表示删除成功
    const result = Reflect.deleteProperty(target, key);
    if (result && hasOwn(target, key)) {
        trigger(TrackTypes.TARGET_TO_KEY, target, key)
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