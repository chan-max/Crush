import { getRefDeps, Ref } from "./ref";


export function watchRef(ref: Ref, callback: Function) {
    const deps = getRefDeps(ref)
    const watchEffect = () => callback.call(null, ref.value, ref.oldValue)
    deps.add(watchEffect)
    // unwatch
    return () => deps.delete(watchEffect)
}



