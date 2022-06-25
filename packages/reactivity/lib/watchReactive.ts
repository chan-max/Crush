import { isProxyType, isReactive, toRaw } from "./common";
import { getDeps, watchDepsSymbol } from "./effect";
import { getLastSetKey, getLastSetNewValue, getLastSetOldValue, getLastSetTarget, onSet } from "./handler";


//! 回调中能拿到的数据有 改变的key ，改变的新值 ， 改变前的值
export function shallowWatchReactive(data: any, callback: any) {
    if (!isReactive(data)) {
        return
    }

    // 问题？ 新设置的key无法触发依赖，因为没收集

    const rawData = toRaw(data)

    let watchCallback = () => {
        callback.call(null, getLastSetKey(), getLastSetNewValue(), getLastSetOldValue())
    }

    const deps = getDeps(rawData, watchDepsSymbol)
    deps.add(watchCallback)

    // unwatch
    return () => deps.delete(watchCallback)
}



export function watchReactive(reactiveData: any, callback: any) {
    // 问题需要记录子数据脱离绑定的情况
    // 保存当前 watch 的data中存在的所有 target 
    const targets = new Set()
    collectTarget(reactiveData)

    function collectTarget(data: any) {
        if (!isReactive(data)) {
            return
        }
        targets.add(toRaw(data))
        Object.values(data).forEach(collectTarget)
    }

    let cb = () => {
        callback.call(null, getLastSetTarget(), getLastSetKey(), getLastSetNewValue(), getLastSetOldValue())
    }

    targets.forEach((target: any) => {
        let deps = getDeps(target, watchDepsSymbol)
        deps.add(cb)
    })

    const unSet = onSet((target: any, key: any, newValue: any, oldValue: any) => {
        if (!targets.has(oldValue)) { // 当前更改的值与侦测目标无任何关系
            return
        }
        // 解绑
        let oldValueDeps = getDeps(oldValue, watchDepsSymbol)
        oldValueDeps.delete(cb)
        targets.delete(oldValue)
        // 增加新绑定值的依赖
        if (targets.has(newValue)) {
            // 此时是将观察对象中的值重新赋值给该对象的身上，不需要添加依赖
            return
        }
        if (isProxyType(newValue)) {
            let newValueDeps = getDeps(newValue, watchDepsSymbol)
            newValueDeps.add(cb)
            targets.add(newValue)
        }
    })

    // unwatch
    return () => {
        unSet()
        targets.forEach((target: any) => {
            let deps = getDeps(target, watchDepsSymbol)
            deps.delete(cb)
        })
    }
}


// 指定侦测的目标和key值
export function watchTargetKey(target: any, key: any, callback: any) {
    if (!isReactive(target)) {
        return
    }
    const deps = getDeps(target, key)
    const cb = () => callback.call(null, getLastSetNewValue(), getLastSetOldValue())
    deps.add(cb)
    // unwatch
    return () => deps.delete(cb)
}