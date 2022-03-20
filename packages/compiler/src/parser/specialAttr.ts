import {
    camelize
} from '@crush/common'

const inlineStyleDelimiter = /\s*[:;]\s*/
function parseInlineStyle(styleString: string) {
    var chips = styleString.trim().split(inlineStyleDelimiter)
    var l = chips.length
    var styleMap: Record<string, any> = {}
    while (l) {
        styleMap[camelize(chips[l - 2])] = chips[l - 1]
        l -= 2
    }
    return styleMap
}

const inlineClassDelimiter = /\s+/
function parseInlineClass(classString: string) {
    return classString.trim().split(inlineClassDelimiter)
}

export {
    parseInlineStyle,
    parseInlineClass
}