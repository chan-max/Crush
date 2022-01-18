const isNumber = (value: any) => typeof value === 'number'
const isString = (value: any) => typeof value === 'string'
const isArray = Array.isArray
const isObject = (value: any) => Reflect.apply(Object.prototype.toString, value, []) === '[object Object]'
const isUndefined = (value:any) => typeof value === 'undefined'




function typeOf(value:any) {
    return Object.prototype.toString.call(value).slice(8,-1).toLowerCase()
}




export {
    isNumber,
    isString,
    isArray,
    isObject,
    isUndefined,
    typeOf
}