import { emptyObject } from "@crush/common"
import { createRefValueSetter, ref, Ref } from "@crush/reactivity/lib/ref"
import { watchRef } from "@crush/reactivity/lib/watchRef"
import { getCurrentScope } from "@crush/renderer"



export function createState(value: any, refOptions?: any): any {
    let scope = getCurrentScope()
    var state = ref(value, refOptions)
    var setState = createRefValueSetter(state)
    var watcher = (callback: any) => watchRef(state, callback)

    let i = 0

    return new Proxy(emptyObject, {
        get(_, key) {
            switch (i) {
                case 0:
                    // provide to scope
                    scope[key] = state
                    i++
                    return state
                case 1:
                    // provide to scope
                    scope[key] = setState
                    i++
                    return setState
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

