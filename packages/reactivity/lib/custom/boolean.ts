import { Ref } from "../ref"


class ReactiveBoolean extends Ref {
    constructor(value: boolean) {
        super(value)
    }
    toggle() {
        return this.value = !this.value
    }
    toTrue() {
        return this.value = true
    }
    toFalse() {
        return this.value = false
    }
}

export function useBoolean(value: boolean = true) {
    return new ReactiveBoolean(value)
}