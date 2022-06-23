import { Ref } from "../ref"


class ReactiveNumber extends Ref {
    constructor(value: number) {
        super(value)
    }

    plus(value: number = 1) {
        return this.value += value
    }

    minus(value: number = 1) {
        return this.value -= value
    }

    multiply(value: number = 1) {
        return this.value *= value
    }

    devide(value: number = 1) {
        return this.value /= value
    }
}

export function useNumber(value: number) {
    return new ReactiveNumber(value)
}