import {
    getEmptyMap
} from './value'

export const arrayToMap = (arr: string[], mapValue: any = true) => arr.reduce((res, item) => {
    res[item] = mapValue
    return res
}, getEmptyMap() as Record<string, any>)

export const stringToMap = (str: string, delimiter: string | RegExp) => arrayToMap(str.split(delimiter))

// from vue
export const makeMap = (str: string, delimiter: string = ',') => {
    var map: Record<string, boolean> = arrayToMap(str.split(delimiter))
    return (key: string) => !!map[key]
}