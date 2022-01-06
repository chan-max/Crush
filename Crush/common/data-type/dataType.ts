const isNumber = (value: any) => typeof value === 'number'
const isString = (value: any) => typeof value === 'string'
const isArray = Array.isArray
const isObject = (value: any) => Reflect.apply(Object.prototype.toString, value, []) === '[object Object]'
const isUndefined = (value:any) => typeof value === 'undefined'

export {
    isNumber,
    isString,
    isArray,
    isObject,
    isUndefined
}