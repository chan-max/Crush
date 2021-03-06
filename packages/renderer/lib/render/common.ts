import {
    isNumber
} from '@crush/common'
import {
    emptyObject
} from '@crush/common'

export const insertNull = (arr: any[], index: number, length: number = 1) => arr.splice(index, 0, ...new Array(length).fill(null))


export const isReservedProp = (key: string) => key.startsWith(`_`)
export const getReservedProp = (key: string) => key.slice(1)

export function unionkeys(...maps: Record<string, any>[]): string[] {
    var _: Record<string, any> = {}
    for (let i in maps || emptyObject) {
        for (let key in maps[i]) {
            _[key] = true
        }
    }
    return Object.keys(_)
}

/*
    用于 props 的diff 算法 输入两个map类型，
    返回一个map ， 一个key 对应两个value
    例如：
    {
        key1 : [1,2] , 
        key2 : [3,4]
    }
*/
export function createMapEntries<T>(...maps: (Record<string, T> | null)[]): Record<string, T[]> {
    var res: Record<string, T[]> = {}
    for (let i in maps) {
        var map = maps[i]
        if (!map) continue
        for (let key in map) {
            var value = map[key]
            var collection = res[key] ||= []
            collection[i] = value
        }
    }
    return res
}


