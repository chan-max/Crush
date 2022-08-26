import { isString } from "@crush/common"
import { isReactive, isRef, Ref, watchReactive, watchRef, watchTargetKey } from "@crush/reactivity"
import { getCurrentInstance, getCurrentScope } from "@crush/renderer"

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
    return getCurrentInstance().watch(source, cb)
}

// 更加语义化的

export function onPropsChange(cb: any) {
    return watchReactive(getCurrentInstance().props, cb)
}

export function onPropChange(prop: string, cb: any) {
    if (!getCurrentInstance().propsOptions[prop]) {
        return
    }
    return watchTargetKey(getCurrentInstance().props, prop, cb)
}