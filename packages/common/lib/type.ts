
function isNumber(value: any) {
    return typeof value === 'number' && !isNaN(value)
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
    return value && isFunction(value.then) && isFunction(value.catch);
};

const isDate = (value: any) => value instanceof Date

const isArray = Array.isArray

// 将一个值转换成数字，失败的话，返回本身
function toNumber(value: any) {
    let numberValue = Number(value)
    return isNumber(numberValue) ? numberValue : value
}


export {
    isNumber,
    isArray,
    isString,
    isFunction,
    isUndefined,
    isObject,
    typeOf,
    isPromise,
    isDate,
    isNumberString,
    toNumber
}