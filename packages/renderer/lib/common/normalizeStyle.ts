import { isArray, isFunction, isObject, isString } from "@crush/common"
import { parseInlineStyle } from "@crush/compiler"
import { extend } from "./extend";

/*  
     always return a map
*/

export function normalizeStyle(style: any): any {
    if (isObject(style)) {
        return style
    } else if (isString(style)) {
        return parseInlineStyle(style)
    } else if (isArray(style)) {
        style = style.map(normalizeStyle)
        return extend(...style)
    } else if (isFunction(style)) {
        return normalizeStyle(style())
    } else {
        return style
    }
}