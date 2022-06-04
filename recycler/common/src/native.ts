import { EMPTY_ARR } from "./value"


var SYMBOL_ITERATOR = Symbol.iterator

export const keys = (value: any) => value ? Object.keys(value) : EMPTY_ARR