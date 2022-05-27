
function isNumber(value: any) {
    return typeof value === 'number' && value !== NaN
}

function isString(value:any){
    return typeof value === 'string' 
}



const isArray = Array.isArray

export {
    isNumber,
    isArray,
    isString
}