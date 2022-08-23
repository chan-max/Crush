import {
    isObject,
    isArray,
    isString,
    isUndefined
} from '@crush/common'

const NULL = 'null'

const toBackQuotes = (_: string): string => '`' + _ + '`'
const toSingleQuotes = (_: string): string => "'" + _ + "'"

/*  use JSON.stringify will fill the " in every propertynames */

const objectStringify = (target: any): string => {
    return '{' +
        Object.entries(target).map(([property, value]: any) => {
            return property + ':' + (isObject(value) ? objectStringify(value) : isArray(value) ? toArray(value) : value)
        }).join(',')
        + '}'
}

const stringify = (target: any): string => {
    if (isString(target)) {
        return target
    } else if (isArray(target)) {
        return `[${target.map(stringify).join(',')}]` // 格式化
    } else if (isObject(target)) {
        return '{' +
            Object.entries(target).map(([property, value]: any) => {
                return property + ':' + stringify(value)
            }).join(',')
            + '}'
    } else if (isUndefined(target)) {
        return ''
    } else {
        return String(target)
    }
}

const toArrowFunction = (returned: string, ...params: string[]) => {
    return `(${params.join(',')})=>(${returned})`
}

/* to ternary expression */
const toTernaryExp = (condition: string, ifTrue: string, ifFalse: string): string => `${condition}?${ifTrue}:${ifFalse}`
const toArray = (items: any) => `[${items.join(',')}]`

const dynamicMapKey = (key: string) => `[${key}]`

const callFn = (fnName: string, ...params: string[]) => {
    // 去掉最后的空参数
    while (params.length !== 0 && !params[params.length-1]) {
        params.pop()
    }
    return `${fnName}(${params.join(',')})`
}

const ternaryExp = (condition: string, ifTrue: string, ifFalse: string): string => `${condition}?(${ifTrue}):(${ifFalse})`

function ternaryChains(conditions: string[], returns: string[], falseDefault = 'undefined', index = 0): string {
    return ternaryExp(
        conditions[index],
        returns[index],
        index < conditions.length - 1 ? ternaryChains(conditions, returns, falseDefault, ++index) : (returns[index + 1] || falseDefault)
    )
}

const destructur = (target: string) => `...${target}`
var declare = (name: string, value: string) => `const ${name} = ${value} ;`

const toReservedProp = (prop: string) => `_${prop}`

export {
    ternaryExp,
    ternaryChains,
    dynamicMapKey,
    toBackQuotes,
    toTernaryExp,
    toArray,
    toSingleQuotes,
    objectStringify,
    toArrowFunction,
    callFn,
    destructur,
    declare,
    NULL,
    stringify,
    toReservedProp
}