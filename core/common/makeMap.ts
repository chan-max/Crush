import { getEmptyObj } from "./value"

export const arrayToMap = (arr: string[], mapValue: any = true) => arr.reduce((res, item) => {
    res[item] = mapValue
    return res
}, getEmptyObj() as Record<string, any>)

export const stringToMap = (str: string, delimiter: string | RegExp) => arrayToMap(str.split(delimiter))

// from vue
export const makeMap = (str: string, delimiter: string = ',') => {
    var map: Record<string, boolean> = arrayToMap(str.split(delimiter))
    return (key: string) => !!map[key]
}

export function setArrayKey() {

}
