import { Ref } from "../ref"

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