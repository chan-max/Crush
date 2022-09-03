import { ComputedRef } from "./computed";

import { Ref } from "./ref";
import { getDeps } from "./effect";

export function watchComputed(computed: ComputedRef, callback: Function) {
    const deps = getDeps(computed)
    const watchEffect = () => callback.call(null, computed.value, computed.oldValue)
    deps.add(watchEffect)

    // force computed
    computed.value
    // unwatch1
    return () => deps.delete(watchEffect)
}

