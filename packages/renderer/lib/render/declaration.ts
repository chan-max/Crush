import {
    isArray,
    isString,
    isObject,
    emptyObject,
    camelize, hyphenate,
} from '@crush/common'

import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY
} from '../common/important'


import { unionkeys } from "./common";


export type StyleValue = {
    value: string
    important: boolean
}

// 目前只支持两层
function joinArrayStyleValue(value: any, firstLevelSeparator = { value: ' ' }) {
    return value.map((item: any) => {
        if (isArray(item)) {
            firstLevelSeparator.value = ','
            return item.join(' ')
        } else {
            return item
        }
    }).join(firstLevelSeparator.value)
}

export function parseStyleValue(rawValue: any): any {
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
        value = joinArrayStyleValue(value)
    }

    return {
        value,
        important
    }
}



export function updateDeclaration(style: CSSStyleDeclaration, pDeclaration: any, nDeclaration: any) {
    pDeclaration ||= emptyObject
    nDeclaration ||= emptyObject
    for (let propName of unionkeys(pDeclaration, nDeclaration)) {
        var { value: pValue, important: pImportant } = parseStyleValue(pDeclaration[propName])
        var { value: nValue, important: nImportant } = parseStyleValue(nDeclaration[propName])
        if (pValue !== nValue || pImportant !== nImportant) {
            setStyleProperty(style, propName, nValue, nImportant)
        }
    }
}

export function mountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    return updateDeclaration(style, emptyObject, declaration)
}

// export 
export const setElementStyleDeclaration = (el: HTMLElement, declaration: Record<string, any>) => mountDeclaration(el.style, declaration)


export function unmountDeclaration(style: CSSStyleDeclaration, declaration: any) {
    return updateDeclaration(style, declaration, emptyObject)
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

export function getElementComputedStyleValue(el: HTMLElement, key: string) {
    return getStyleValue(window.getComputedStyle(el), key)
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