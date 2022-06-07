import { ReactiveFlags } from "./common"

export const computed = (getter: any) => new Computed(getter)

class Computed {

    [ReactiveFlags.IS_COMPUTED]: any = true;
    [ReactiveFlags.IS_REF]: any = true

    _value: any

    getter: any

    shouldCompute = true

    constructor(getter: any) {
        this.getter = getter
    }

    get value() {
        return this.shouldCompute ? this.getter() : this._value
    }
}