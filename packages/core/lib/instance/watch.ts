import { isString } from "@crush/common"
import { isReactive, isRef, Ref, watchReactive, watchRef, watchTargetKey } from "@crush/reactivity"
import { getCurrentScope } from "@crush/renderer"

export function createInstanceWatch(instance: any) {
    return (source: any, cb: any) => {
        let scope = instance.scope
        if (isString(source)) {
            return watchTargetKey(scope, source, cb)
        } else if (isReactive(source)) {
            return watchReactive(source, cb)
        } else if (isRef(source)) {
            return watchRef(source, cb)
        }
    }
}


// create hook watch , 只能在create钩子中使用

export function watch(source: any, cb: any) {
    if (isString(source)) {
        return watchTargetKey(getCurrentScope(), source, cb)
    } else if (isReactive(source)) {
        return watchReactive(source, cb)
    } else if (isRef(source)) {
        return watchRef(source, cb)
    }
}
