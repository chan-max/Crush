import {
    isArray,
    isString,
    isObject,
    EMPTY_OBJ ,
    camelize, hyphenate,
} from '@crush/common'

import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'


import { getUnionkeysFromMaps } from "./common";


export type StyleValue = {
    value: string
    important: boolean
}

export function parseStyleValue(rawValue: any): StyleValue {
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
    for (let propName of getUnionkeysFromMaps(pDeclaration, nDeclaration)) {
        var { value: pValue, important: pImportant } = parseStyleValue(pDeclaration[propName])
        var { value: nValue, important: nImportant } = parseStyleValue(nDeclaration[propName])
        if (pValue !== nValue || pImportant !== nImportant) {
            setStyleProperty(style, propName, nValue, nImportant)
        }
    }
}

export function mountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    return updateDeclaration(style, EMPTY_OBJ, declaration)
}

// export 
export const setElementStyleDeclaration = (el: HTMLElement, declaration: Record<string, any>) => mountDeclaration(el.style, declaration)


export function unmountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    return updateDeclaration(style, declaration, EMPTY_OBJ)
}



import {
    important
} from '../common/important'
import { setStyleProperty } from '../style';



// ready for animation and transition

export function getStyleValue(style: CSSStyleDeclaration, key: string) {
    var property = hyphenate(key)
    var value = style.getPropertyValue(property)
    var isImportant = !!style.getPropertyPriority(property);
    return isImportant ? important(value) : value
}

export function getElementStyleValue(el: HTMLElement, key: string) {
    return getStyleValue(el.style, key)
}

export function getStyle(style: CSSStyleDeclaration, keys: Record<string, any> | string[] | string): Record<string, any> {
    if (isObject(keys)) {
        keys = Object.keys(keys)
    } else if (isString(keys)) {
        keys = (keys as string).split(',')
    }
    var declaration: Record<string, any> = {}
    for (let key of keys as string[]) {
        declaration[camelize(key)] = getStyleValue(style, key)
    }
    return declaration
}

export function getElementStyle(el: HTMLElement, keys: Record<string, any> | string[] | string): Record<string, any> {
    return getStyle(el.style, keys)
}

export function getElementComputedStyle(el: HTMLElement, keys: Record<string, any> | string[] | string): Record<string, any> {
    return getStyle(window.getComputedStyle(el), keys)
}