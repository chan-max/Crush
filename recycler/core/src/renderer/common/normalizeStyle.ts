import { isArray, isObject, isString } from "@crush/common";
import { parseInlineStyle } from "../../../../compiler"
import { extend } from "./extend";

/*  
    the result always return a map
*/

export function normalizeStyle(style: any) {
    if (isObject(style)) {
        return style
    } else if (isString(style)) {
        return parseInlineStyle(style)
    } else if (isArray(style)) {
        style = style.map(normalizeStyle)
        return extend(...style)
    }
}