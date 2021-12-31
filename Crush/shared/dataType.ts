function isString(value: any) {
    return typeof value === 'string'
}

function isNumber(value: any) {
    return typeof value === 'number'
}

const isArray = Array.isArray

export {
    isNumber,
    isString,
    isArray
}