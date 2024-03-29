import { isComputed } from "./computed";
import { getRefDeps, Ref } from "./ref";
import { getDeps } from "./effect";

export function watchRef(ref: Ref, callback: Function) {
    const deps = getRefDeps(ref)
    const watchEffect = () => callback.call(null, ref.value, ref.oldValue)
    deps.add(watchEffect)
    // unwatch

    if (isComputed(ref)) {
        ref.value
    }

    return () => deps.delete(watchEffect)
}



