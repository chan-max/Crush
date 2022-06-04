import {
    camelize
} from '@crush/common'
import {
    toSingleQuotes
} from '../stringify'


const inlineStyleDelimiter = /\s*[:;]\s*/
export function parseInlineStyle(styleString: string): Record<string, string> {
    var chips = styleString.split(inlineStyleDelimiter).filter(Boolean)
    var l = chips.length
    var styleMap: Record<string, any> = {}
    while (l) {
        styleMap[camelize(chips[l - 2])] = toSingleQuotes(chips[l - 1])
        l -= 2
    }
    return styleMap
}


import {
    stringToMap
} from '@crush/common'
const inlineClassDelimiter = /\s+/
export const parseInlineClass = (classString: string): Record<string, boolean> => stringToMap(classString, inlineClassDelimiter)

