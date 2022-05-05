import {
    isString, removeFromArray
} from '@crush/common'
import { EMPTY_MAP } from '@crush/common/src/value'
import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'

import { nodeOps } from './nodeOps'

export function getDeclarationValue(rawValue: any) {
    var value, important
    if (!rawValue) {
        value = null // 这里不能用空字符串，因为会进入下面的判断
        important = false
    } else if (rawValue[IMPORTANT_SYMBOL]) {
        value = rawValue.value
        important = true
    } else {
        value = rawValue
        important = false
    }

    if (isString(value) && value.endsWith(IMPORTANT_KEY)) {
        value = value.split(IMPORTANT_KEY)[0].trim()
        important = true
    }
    return {
        value,
        important
    }
}


export function updateDeclaration(pDeclaration: any, nDeclaration: any, style: CSSStyleDeclaration, vnode: any) {
    var delList = Object.keys(pDeclaration ||= EMPTY_MAP)
    for (let property in nDeclaration) {
        var { value: pValue, important: pImportant } = getDeclarationValue(pDeclaration[property])
        var { value: nValue, important: nImportant } = getDeclarationValue(nDeclaration[property])
        if (pValue !== nValue || pImportant !== nImportant) { /* 当属性值不同并且important不同时均需要更新 */
            /*
                目前处理值只能处理字符串的属性值
            */
            nodeOps.setProperty(style, property, nValue, nImportant)
        }
        removeFromArray(delList, property)
    }
    delList.forEach((property: string) => nodeOps.setProperty(style, property, '')) // 清空旧的属性
}

export function mountDeclaration(declaration: any, style: any, vnode: any) {
    updateDeclaration(EMPTY_MAP, declaration, style, vnode)
}