import { ReactiveFlags } from "./common"

export function ref(value: any) {
    return new Ref(value)
}

class Ref {

    [ReactiveFlags.IS_REF] = true

    _value: any

    constructor(value: any) {
        this._value = value
    }

    get value() {
        // track
        console.warn('ref track');
        return this._value
    }

    set value(newValue) {
        if (this._value === newValue) {
            return
        }
        this._value = newValue
        // trigger
        console.warn('ref trigger');
    }

}



