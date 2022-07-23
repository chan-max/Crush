import { isComputed } from "./computed";
import { Ref } from "./ref";
import { getDeps } from "./effect";

export function watchRef(ref: Ref, callback: Function) {
    const deps = getDeps(ref)
    const watchEffect = () => callback.call(null, ref.value, ref.oldValue)
    deps.add(watchEffect)
    // unwatch

    if (isComputed(ref)) {
        ref.value
    }

    return () => deps.delete(watchEffect)
}



