import {
    isArray,
    isString,
} from '../../common/type'
import { EMPTY_OBJ } from '../../common/value'
import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'

import { nodeOps } from './nodeOps'

import { removeFromArray } from '../../common/operate'

export function getDeclarationValue(rawValue: any) {
    var value, important = false
    if (rawValue === undefined || rawValue === null) {
        value = null
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

    // 支持数组
    if (isArray(value)) {
        value = value.join(' ')
    }

    return {
        value,
        important
    }
}


export function updateDeclaration(style: CSSStyleDeclaration, pDeclaration: any, nDeclaration: any) {
    var delList = Object.keys(pDeclaration ||= EMPTY_OBJ)
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

export function mountDeclaration(style: any, declaration: any) {
    updateDeclaration(style, EMPTY_OBJ, declaration)
}

export function unmountDeclaration(style: any, declaration: any) {
    updateDeclaration(style, declaration, EMPTY_OBJ)
}   