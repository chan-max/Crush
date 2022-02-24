import {
    camelize
} from '../../common/transformString'

const inlineStyleDelimiter = /\s*[:;]\s*/
function parseInlineStyle(styleString: string) {
    var chips = styleString.trim().split(inlineStyleDelimiter)
    var l = chips.length
    var styleMap = {}
    while (l) {
        styleMap[camelize(chips[l - 2])] = chips[l - 1]
        l -= 2
    }
    return styleMap
}

const inlineClassDelimiter = /\s+/
function parseInlineClass(classString) {
    return classString.trim().split(inlineClassDelimiter)
}

export {
    parseInlineStyle,
    parseInlineClass
}