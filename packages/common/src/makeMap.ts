import {
    getEmptyMap
} from './value'

export const arrayToMap = (arr: string[], mapValue: any = true) => arr.reduce((res, item) => {
    res[item] = mapValue
    return res
}, getEmptyMap() as Record<string, any>)

export const makeMap = (str: string) => {
    var map: Record<string, boolean> = arrayToMap(str.split(','))
    return (key: string) => !!map[key]
}