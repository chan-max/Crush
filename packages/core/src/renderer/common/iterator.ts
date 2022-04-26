import {
    isArray,
    isNumber,
    isObject
} from "@crush/common"


export type Iterator = number | string | any[] | Object | Map<any, any> | Set<any>
export type NativeIterator = string | any[] | Map<any, any> | Set<any>

var iterableFlag = Symbol.iterator

var isIterableData = (data: any) => !!data[iterableFlag]

export var renderList = (data: Iterator, callee: Function, key: number) => {
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
        var res = isArray(item) ? callee(...item, i) : callee(item, i)
        if (res) {
            results.push(res)
            /* set ukey for diff */
            res.key = key + '_' + i
            // i++
        }
        i++ 
        /*
            需要在循环外部 i++ ，这样保证即使有空元素被排出后，索引位置也是正确的
        */
    }
    return results
}