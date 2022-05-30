import {
    isArray,
    isString,
} from '../../common/type'
import { EMPTY_OBJ } from '../../common/value'
import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'

import { } from '../dom'

import { unionKeys } from "./common";
import { camelize, hyphenate, isObject } from '@crush/common';

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
            setStyleProperty(style, propName, nValue, nImportant)
        }
    }
}

export function mountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    updateDeclaration(style, EMPTY_OBJ, declaration)
}

export function unmountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    updateDeclaration(style, declaration, EMPTY_OBJ)
}

// export 

export const setStyleDeclaration = (el: HTMLElement, declaration: Record<string, any>) => mountDeclaration(el.style, declaration)

import {
    important
} from '../common/important'
import { setStyleProperty } from '../style';

export function getStyleDeclaration(el: HTMLElement, getter: Record<string, any> | string[]): Record<string, any> {
    if (isObject(getter)) {
        getter = Object.keys(getter)
    }
    var style = el.style
    var declaration: Record<string, any> = {}
    for (let key of getter as string[]) {
        var property = hyphenate(key)
        var value = style.getPropertyValue(property)
        var isImportant = !!style.getPropertyPriority(property);
        declaration[camelize(property)] = isImportant ? important(value) : value
    }
    return declaration
}