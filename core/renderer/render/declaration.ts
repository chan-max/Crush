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


import { unionKeys } from "./common";

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
    pDeclaration ||= EMPTY_OBJ
    nDeclaration ||= EMPTY_OBJ
    for (let propName of unionKeys(pDeclaration, nDeclaration)) {
        var { value: pValue, important: pImportant } = getDeclarationValue(pDeclaration[propName])
        var { value: nValue, important: nImportant } = getDeclarationValue(nDeclaration[propName])
        if (pValue !== nValue || pImportant !== nImportant) {
            nodeOps.setProperty(style, propName, nValue, nImportant)
        }
    }
}

export function mountDeclaration(style: any, declaration: any) {
    updateDeclaration(style, EMPTY_OBJ, declaration)
}

export function unmountDeclaration(style: any, declaration: any) {
    updateDeclaration(style, declaration, EMPTY_OBJ)
}   