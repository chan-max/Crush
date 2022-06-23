import { isReactive, toRaw } from "./common";
import { getDeps, targetChangeCollectSymbol } from "./effect";
import { getLastSetKey, getLastSetNewValue, getLastSetOldValue } from "./handler";


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

    const deps = getDeps(rawData, targetChangeCollectSymbol)
    deps.add(watchCallback)

    // unwatch
    return () => {
        for (let key in rawData) {
            const deps = getDeps(rawData, key)
            deps.delete(watchCallback)
        }
    }
}