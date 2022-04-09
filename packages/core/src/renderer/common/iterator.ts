import {
    isArray,
    isNumber,
    isObject
} from "@crush/common"


export type Iterator = number | string | any[] | Object | Map<any, any> | Set<any>
export type NativeIterator = string | any[] | Map<any, any> | Set<any>

var iterableFlag = Symbol.iterator

var isIterableData = (data: any) => !!data[iterableFlag]

export var iterator = (data: Iterator, callee: Function) => {
    if (!isIterableData(data)) {
        if (isNumber(data)) {
            var from = []
            for (var j = 0; j < data; j++) {
                from[j] = j + 1
            }
            data = from
        } else if (isObject(data)) {
            data = Object.entries(data)
        }
    }
    var i = 0
    var results: any = []

    for (var item of data as NativeIterator) {
        results[i] = isArray(item) ? callee(...item, i) : callee(item, i)
        i++
    }
    return results
}