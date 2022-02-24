import {
    isObject,
    isArray
} from '../../common/dataType'

const toFunctionCall = (functionName: string, parameters: string[] = []) => `${functionName}(${parameters.join(',')})`
const toBackQuotes = (_: string): string => '`' + _ + '`'
const toString = (_: string): string => "'" + _ + "'"

/*  use JSON.stringify will fill the " in every propertynames */
/*
    使用json.stringify会把所有key，value加上双引号
*/
const objectStringify = (target: any): string => {
    return '{' +
        Object.entries(target).map(([property, value]: any) => {
            return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? toArray(value) : value)
        }).join(',')
        + '}'
}

const toArrowFunction = (returned: string, params?: string[]) => {
    return `(${params.join(',')})=>(${returned})`
}

/* to ternary expression */
const toTernaryExp = (condition: string, ifTrue: string, ifFalse: string): string => `${condition}?${ifTrue}:${ifFalse}`
const toArray = (items: any) => `[${items.join(',')}]`

const dynamicMapKey = (key: string) => `[${key}]`

const ternaryExp = (condition:string, ifTrue:string, ifFalse:string):string => `${condition}?(${ifTrue}):(${ifFalse})`
function ternaryChains(conditions:string[], returns:string[], index = 0):string {
    return ternaryExp(
        conditions[index],
        returns[index],
        index < conditions.length - 1 ? ternaryChains(conditions, returns, ++index) : returns[index + 1]
    )
}

export {
    ternaryExp,
    ternaryChains,
    dynamicMapKey,
    toFunctionCall,
    toBackQuotes,
    toTernaryExp,
    toArray,
    toString,
    objectStringify,
    toArrowFunction,
}