
function isNumber(value: any) {
    return typeof value === 'number' && value !== NaN
}

function isString(value: any): boolean {
    return typeof value === 'string'
}

const isNumberString = (value: any) => isNumber(Number(value))

const isObject = (value: any) => objectToString.call(value) === '[object Object]'
const isUndefined = (value: any) => typeof value === 'undefined'

const isFunction = (value: any) => typeof value === 'function'

const objectToString = Object.prototype.toString

function typeOf(value: any) {
    // ! do not toLowerCase
    return objectToString.call(value).slice(8, -1)
}

const isPromise = (value: any) => {
    return isObject(value) && isFunction(value.then) && isFunction(value.catch);
};

const isDate = (value: any) => value instanceof Date

const isArray = Array.isArray

export {
    isNumber,
    isArray,
    isString,
    isFunction,
    isUndefined,
    isObject,
    typeOf,
    isPromise,
    isNumberString
}