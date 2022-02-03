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

var nativeIterableFlag = Symbol.iterator

var isIterableData = (data: any) => !!data[nativeIterableFlag]

export const iterateCall = (data: any, callee: Function) => {
    var results: any = []
    var i = 0
    if (isIterableData(data)) {
        for (var item of data) {
            results[i] = isArray(item) ? callee(...item, i) : callee(item, i)
            i++
        }

    } else if (isNumber(data)) {

    }
    return results
}