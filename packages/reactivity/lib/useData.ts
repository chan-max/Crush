import { extend } from "../../compiler/node_modules/@crush/renderer";
import { Ref } from "./ref";

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

class ReactiveString extends Ref {
    constructor(value: string) {
        super(value)
    }
    concat(...values: any[]) {
        return this.value.concat(...values)
    }
    padEnd(targetLength: number, padString: string) {
        return this.value = this.value.padEnd(targetLength, padString)
    }
}

export function useString(value: string = 'hello world') {
    return new ReactiveString(value)
}

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



export function useColor() {
    
}