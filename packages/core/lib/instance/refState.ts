import { emptyObject } from "@crush/common"
import { createRefValueSetter, ref, Ref } from "@crush/reactivity/lib/ref"
import { watchRef } from "@crush/reactivity/lib/watchRef"
import { getCurrentScope } from "@crush/renderer"



export function useRefState(value: any): any {
    let scope = getCurrentScope()
    var _ref = ref(value)
    var setter = createRefValueSetter(_ref)
    var watcher = (cb: any) => watchRef(_ref, cb)
    let i = 0
    return new Proxy(emptyObject, {
        get(_, key) {
            switch (i) {
                case 0:
                    // provide to scope
                    scope[key] = _ref
                    i++
                    return _ref
                case 1:
                    // provide to scope
                    scope[key] = setter
                    i++
                    return setter
                case 2:
                    scope[key] = watcher
                    i++
                    return watcher
                default:
                    return null
            }
        }
    })
}

