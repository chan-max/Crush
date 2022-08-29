import { error } from "@crush/common";
import { isProxyType, isReactive, toRaw } from "./common";
import { getDeps, targetObserverSymbol } from "./effect";
import { onSet } from "./handler";


/*
    通问题
    当改变被侦测的数据时，会去执行数据的依赖，但如果依赖中不止有watch注册的回调，还有其他的依赖，并且依赖触发后，依赖中又更改了其他响应式数据的值，这时通过
    获取最近值来传递 watch 的参数不可靠
*/


//! 回调中能拿到的数据有 改变的key ，改变的新值 ， 改变前的值
export function shallowWatchReactive(data: any, callback: any) {
    if (!isReactive(data)) {
        return
    }

    // 问题？ 新设置的key无法触发依赖，因为没收集

    const rawData = toRaw(data)

    var watchCallbackIsCalling = false, changeKey: any, changeNewValue: any, changeOldValue: any;

    let cb = () => {
        watchCallbackIsCalling = true
        callback.call(null, changeKey, changeNewValue, changeOldValue)
        watchCallbackIsCalling = false
    }

    let unSet = onSet((target: any, key: any, newValue: any, oldValue: any) => {
        if (target === rawData) {
            if (watchCallbackIsCalling) {
                // callback 中重新设置值会触发死递归
                error('cant set reactive data value in the watch callback')
            } else {
                // 设置的值是watchdata中的值，并且不是在回调函数中
                changeKey = key
                changeNewValue = newValue
                changeOldValue = oldValue
            }
        }
    })

    const deps = getDeps(rawData, targetObserverSymbol)
    deps.add(cb)

    // unwatch
    return () => {
        unSet()
        deps.delete(cb)
    }
}



export function watchReactive(reactiveData: any, callback: any) {
    if (!isReactive(reactiveData)) {
        return
    }
    // 问题需要记录子数据脱离绑定的情况
    // 保存当前 watch 的data中存在的所有 target 
    // 当侦测一个reactive data时，回调中不应该再设置该属性的值否则会死循环


    const targets = new Set()
    collectTarget(reactiveData)

    function collectTarget(data: any) {
        if (!isReactive(data)) {
            return
        }
        targets.add(toRaw(data))
        Object.values(data).forEach(collectTarget)
    }


    // watch的回调函数是否正在调用
    var watchCallbackIsCalling = false, changeTarget: any, changeKey: any, changeNewValue: any, changeOldValue: any;

    let cb = () => {
        watchCallbackIsCalling = true
        callback.call(null, changeTarget, changeKey, changeNewValue, changeOldValue)
        watchCallbackIsCalling = false
    }

    targets.forEach((target: any) => {
        let deps = getDeps(target, targetObserverSymbol)
        deps.add(cb)
    })

    const unSet = onSet((target: any, key: any, newValue: any, oldValue: any) => {

        if (targets.has(target)) {
            if (watchCallbackIsCalling) {
                // callback 中重新设置值会触发死递归
                error('cant set reactive data value in the watch callback')
            } else {
                // 设置的值是watchdata中的值，并且不是在回调函数中
                changeTarget = target
                changeKey = key
                changeNewValue = newValue
                changeOldValue = oldValue
            }
        }

        if (!targets.has(oldValue)) { // 当前更改的值与侦测目标无任何关系
            return
        }
        // 解绑
        let oldValueDeps = getDeps(oldValue, targetObserverSymbol)
        oldValueDeps.delete(cb)
        targets.delete(oldValue)
        // 增加新绑定值的依赖
        if (targets.has(newValue)) {
            // 此时是将观察对象中的值重新赋值给该对象的身上，不需要添加依赖
            return
        }
        if (isProxyType(newValue)) {
            let newValueDeps = getDeps(newValue, targetObserverSymbol)
            newValueDeps.add(cb)
            targets.add(newValue)
        }
    })

    // unwatch
    return () => {
        unSet()
        targets.forEach((target: any) => {
            let deps = getDeps(target, targetObserverSymbol)
            deps.delete(cb)
        })
    }
}


// 指定侦测的目标和key值
export function watchTargetKey(reactiveTarget: any, key: any, callback: any) {
    if (!isReactive(reactiveTarget)) {
        return
    }

    let target = toRaw(reactiveTarget)
    const deps = getDeps(target, key)

    var watchCallbackIsCalling = false, changeNewValue: any, changeOldValue: any;

    let cb = () => {
        watchCallbackIsCalling = true
        callback.call(null, changeNewValue, changeOldValue)
        watchCallbackIsCalling = false
    }

    const unSet = onSet((_target: any, _key: any, newValue: any, oldValue: any) => {
        if (_target === target && _key === key) { // 侦听目标的对应key触发了
            if (watchCallbackIsCalling) {
                // callback 中重新设置值会触发死递归
                error('cant set reactive data value in the watch callback')
            } else {
                // 设置的值是watchdata中的值，并且不是在回调函数中
                changeNewValue = newValue
                changeOldValue = oldValue
            }
        }
    })

    deps.add(cb)
    // unwatch
    return () => {
        unSet()
        deps.delete(cb)
    }
}