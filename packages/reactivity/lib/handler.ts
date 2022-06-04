import { isArray, isFunction,hasOwn } from "@crush/common"
import { ReactiveFlags, toRaw } from "./common"
import { reactive, readonly } from "./reactive"

import { track, trigger } from './effect'

// global state
let _isReadonly = false
let _isShallow = false
let _target: any
let _key: any

export const getLastVisitTarget = () => _target
export const getLastVisitKey = () => _key

const collectionHandlers: Record<string, any> = {
    add(value: any) {
        var target = toRaw(this)
        if (_isReadonly) {
            return console.warn(target, 'is readonly , cant add');
        }
        var result = target.add(value)
        console.warn('trigger add');
        // 返回set对象本身
        return result
    },
    // map set
    clear() {
        var target = toRaw(this)
        if (_isReadonly) {
            return console.warn(target, 'is readonly cant clear');
        }
        target.clear()
        console.warn('trigger clear');
        return
    },
    // map weakmap set weakset
    delete(key: any) {
        var target = toRaw(this)
        if (_isReadonly) {
            return console.warn(target, 'is readonly cant delete');
        }
        const result = target.delete(key)
        if (result) { // 返回为 true 为删除成功
            console.warn('trigger');
        }
        return result
    },
    // map set
    entries() {
        var target = toRaw(this)
        console.warn('track')
        return target.entries()
    },
    // map set
    forEach(fn: any) {
        var target = toRaw(this)
        console.warn('track')
        return target.forEach(fn)
    },
    // set map weakset weakmap
    has(key: any) {
        var target = toRaw(this)
        console.warn('track')
        return target.has(key)
    },
    // map set
    keys() {
        var target = toRaw(this)
        console.warn('track')
        return target.keys()
    },
    // map set
    values() {
        var target = toRaw(this)
        console.warn('track')
        return target.values()
    },
    // map weakmap
    set(key: any, value: any) {
        var target = toRaw(this)
        if (_isReadonly) {
            return console.warn(target, 'is readonly , cant set');
        }
        var result = target.set(key, value)
        console.warn('trigger');
        return result
    },
    // map weakmap
    get(key: any) {
        var target = toRaw(this)
        if (!_isReadonly) {
            console.warn('track');
        }
        var value = target.get(key)
        return _isShallow ? value : reactive(value)
    }
}


function arrayHandlerWithTrack(...args: any[]) {
    if (!_isReadonly) { // 非只读才会收集
        console.warn('ARRAY track');
    }
    let result = _target[_key](...args)
    return result
}

function arrayHandlerWithTrigger(...args: any[]) {
    if (_isReadonly) {
        return console.error('readonly');
    }
    let result = _target[_key](...args)
    console.warn('trigger')
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
        return value.bind(_target)
    }
}

function createGetter(isReadonly: boolean, isShallow: boolean, isCollection: boolean) {
    return (target: any, key: any, receiver: any) => {
        // cache global state
        _isReadonly = isReadonly
        _isShallow = isShallow
        _target = target
        _key = key
        // reserved keys
        if (key === ReactiveFlags.RAW) {
            return target
        } else if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_SHALLOW) {
            return isShallow
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }

        if (isCollection) {
            if (key === 'size') {
                track(target)
                return target.size
            }
            if (hasOwn(collectionHandlers, key) && key in target) {
                // collection methods reset
                return collectionHandlers[key]
            }
        } else if (hasOwn(target, key)) {
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
            return true
        }
        if (hasOwn(target, key)) {
            // 不允许设置非自身属性
            Reflect.set(target, key, newValue, receiver)
            console.warn('trigger set', target, key);
        }
        return true
    }
}

function has(target: any, key: any) {
    /*
        has 包括非自身的key
    */
    if (hasOwn(target, key)) {
        console.warn('track has', target, key);
    }
    return Reflect.has(target, key);
}
function ownKeys(target: any) {
    console.warn('track ownKeys', target);
    return Reflect.ownKeys(target);
}

function deleteProperty(target: any, key: any) {
    // 为 true 表示删除成功
    const result = Reflect.deleteProperty(target, key);
    if (result && hasOwn(target, key)) {
        var value = target[key]
        console.warn('trigger deleteProperty');
    }
    return result;
}

function readonlyDeleteProperty(target: any, key: any) {
    console.warn('readonly cant delete');
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