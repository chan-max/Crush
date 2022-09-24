import {
    camelize
} from '@crush/common'


const inlineStyleDelimiter = /\s*[:;]\s*/
export function parseInlineStyle(styleString: string): any {
    var styles = styleString.split(inlineStyleDelimiter).filter(Boolean)
    var l = styles.length

    if (l % 2 === 1) {
        return null
    }

    var styleMap: Record<string, any> = {}
    while (l) {
        styleMap[camelize(styles[l - 2])] = styles[l - 1]
        l -= 2
    }
    return styleMap
}


import {
    stringToMap
} from '@crush/common'
const inlineClassDelimiter = /\s+/
export const parseInlineClass = (classString: string): Record<string, boolean> => stringToMap(classString, inlineClassDelimiter)

