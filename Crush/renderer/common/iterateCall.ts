import {
    isArray,
    isNumber,
    isObject
} from "../../common/dataType"

/*
    provide a source data , and a callee function,
    return the result 
    here is the iterable datatype
    -----
    array
    object
    string
    number
    map
    set
*/

var iterableFlag = Symbol.iterator

var isIterableData = (data: any) => !!data[iterableFlag]

export const iterateCall = (data: any, callee: Function) => {
    var results: any = []
    var i = 0

    if (!data[iterableFlag]) {
        if (isNumber(data)) {
            var from = []
            for (var j = 0; j < data; j++) {
                from[j] = j + 1
            }
            data = from
        }
    }

    for (var item of data) {
        results[i] = isArray(item) ? callee(...item, i) : callee(item, i)
        i++
    }
    return results
}