

const isNumber = (value: any) =>(!isNaN(value)) && (typeof value === 'number') 
const isString = (value: any) => typeof value === 'string'
const isArray = Array.isArray
const isObject = (value: any) => objectToString.call(value) === '[object Object]'
const isUndefined = (value: any) => typeof value === 'undefined'

const isFunction = (value: any) => typeof value === 'function'

var objectToString = Object.prototype.toString

function typeOf(value: any) {
    return objectToString.call(value).slice(8, -1).toLowerCase()
}

const instanceOf = (value: any, constructor: Function) => value.constructor = constructor

const isElement = (el: any) => el instanceof Element

export {
    isNumber,
    isString,
    isArray,
    isObject,
    isUndefined,
    instanceOf,
    typeOf,
    isElement,
    isFunction
}