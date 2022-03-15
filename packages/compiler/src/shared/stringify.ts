import {
    isObject,
    isArray
} from '@crush/common'


const wrapBackQuotes = (_: string): string => '`' + _ + '`'
const wrapSingleQuotes = (_: string): string => "'" + _ + "'" // kawayi
const callFn = (fnName:string, ...params: string[]) => `${fnName}(${params.join(',')})`
const dynamicMapKey = (key: string) => `[${key}]`

const toArrowFn= (returned: string, params?: string[]) => {
    return `(${params?.join(',')})=>(${returned})`
}

const arrayStringify = (items: any) => `[${items.join(',')}]`

const ternaryExp = (condition: string, ifTrue: string, ifFalse: string): string => `${condition}?(${ifTrue}):(${ifFalse})` // safe
function ternaryChains(conditions: string[], returns: string[], index = 0): string {
    return ternaryExp(
        conditions[index],
        returns[index],
        index < conditions.length - 1 ? ternaryChains(conditions, returns, ++index) : returns[index + 1]
    )
}

/*  use JSON.stringify will fill the " in every propertynames */
/*
    使用json.stringify会把所有key，value加上双引号
*/
const objectStringify = (target: any): string => {
    return '{' +
        Object.entries(target).map(([property, value]: any) => {
            return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? arrayStringify(value) : value)
        }).join(',')
        + '}'
}

export {
    ternaryExp,
    ternaryChains,
    dynamicMapKey,
    wrapBackQuotes,
    arrayStringify,
    wrapSingleQuotes,
    objectStringify,
    toArrowFn,
    callFn
}