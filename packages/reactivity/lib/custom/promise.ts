
import { isPromise } from "@crush/common";
import { Ref } from "../ref";

export function usePromise(promise: any) {
    promise = isPromise(promise) ? promise : new Promise(promise)
    return new PromiseRef(promise)
}

class PromiseRef extends Ref {
    resolved = false
    rejected = false
    constructor(promise: any) {
        super(null)
        promise.then((result: any) => {
            this.value = result
            this.resolved = true
        }).catch((err: any) => {
            this.value = null //
            this.rejected = true
        })
    }
}