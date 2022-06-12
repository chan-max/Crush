
import { isFunction, isArray, isObject, isString } from "@crush/common"
import { parseInlineClass } from "@crush/compiler"
import {
    extend
} from './extend'

// normalized class always will be a map with true value
export function normalizeClass(rawClass: any): any {
    /*
        crush class support 
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
        return extend(...rawClass.map(normalizeClass))
    } else if (isFunction(rawClass)) {
        return normalizeClass(rawClass())
    }
}

