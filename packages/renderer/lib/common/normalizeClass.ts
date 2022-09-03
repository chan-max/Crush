
import { isFunction, isArray, isObject, isString, emptyObject } from "@crush/common"
import { parseInlineClass } from "@crush/compiler"
import {
    extend
} from '@crush/common'

// normalized class always will be a map with true value
export function normalizeClass(rawClass: any): Record<string, any> {
    /*
        string
        array
        object
        function : use the return value
    */
    if (isString(rawClass)) {
        return parseInlineClass(rawClass)
    } else if (isObject(rawClass)) {
        return rawClass
    } else if (isArray(rawClass)) {
        return extend({}, ...rawClass.map(normalizeClass))
    } else if (isFunction(rawClass)) {
        return normalizeClass(rawClass())
    } else {
        return emptyObject
    }
}


