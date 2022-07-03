import { ComputedRef } from "./computed";
import { getRefDeps, Ref } from "./ref";


export function watchComputed(computed: ComputedRef, callback: Function) {
    const deps = getRefDeps(computed)
    const watchEffect = () => callback.call(null, computed.value, computed.oldValue)
    deps.add(watchEffect)

    // force computed
    computed.value
    // unwatch1
    return () => deps.delete(watchEffect)
}

