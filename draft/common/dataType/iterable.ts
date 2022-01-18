import { typeOf } from "./dataType"

const isNativeIterableType = (value: any) => value[Symbol.iterator]

const iterableTypes = [
    'array',
    'string',
    'number',
    'object',
    'map',
    'set',
    'boolean'
]

const isIterableType = (value: any) => iterableTypes.includes(typeOf(value))

export {
    isNativeIterableType,
    isIterableType
}