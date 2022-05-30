import {
    isNumber
} from '../../common/type'
import {
    EMPTY_OBJ
} from '../../common/value'

export const insertNull = (arr: any[], index: number, length: number = 1) => arr.splice(index, 0, ...new Array(length).fill(null))


export const isReservedProp = (key: string) => key.startsWith(`_${key}`)
export const getReservedProp = (key: string) => key.slice(1)

export function unionKeys(...maps: Record<string, any>[]): string[] {
    var _: Record<string, any> = {}
    for (let i in maps || EMPTY_OBJ) {
        for (let key in maps[i]) {
            _[key] = true
        }
    }
    return Object.keys(_)
}