
var objectToString = Object.prototype.toString

const isNumber = (value: any) => typeof value === 'number'
const isString = (value: any) => typeof value === 'string'
const isArray = Array.isArray
const isObject = (value: any) => objectToString.call(value) === '[object Object]'
const isUndefined = (value: any) => typeof value === 'undefined'

function typeOf(value: any) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

const instanceOf = (value:any,constructor:Function) => value.constructor = constructor



export {
    isNumber,
    isString,
    isArray,
    isObject,
    isUndefined,
    instanceOf,
    typeOf
}