import { isNumber, isArray, isNumberString } from "../common/type"
import {
    IMPORTANT
} from './common/important'
import { hyphenate } from "../common/transformString"


// support number
export function normalizeKeyText(keyframe: string | number | Array<string | number>): string {
    if (isArray(keyframe)) {
        return keyframe.map(normalizeKeyText).join(',')
    }
    if (isNumberString(keyframe)) {
        // 为数字或者数字字符串
        return `${keyframe}%`
    }
    return `${keyframe}`
}

export const setKeyText = (keyframe: CSSKeyframeRule, key: string | number) => keyframe.keyText = normalizeKeyText(key)

export const insertRule = (sheet: CSSStyleSheet, rule: string, index: number = sheet.cssRules.length): number => sheet.insertRule(rule, index)

export const insertStyle = (sheet: CSSStyleSheet, selector: string, index?: number | undefined): number => insertRule(sheet, `${selector}{}`, index)

export const insertMedia = (sheet: CSSStyleSheet, media: string, index?: number | undefined): number => insertRule(sheet, `@media ${media}{}`, index)

export const insertSupports = (sheet: CSSStyleSheet, supports: string, index?: number | undefined): number => insertRule(sheet, `@supports ${supports}{}`, index)

export const insertKeyframes = (sheet: CSSStyleSheet, keyframes: string, index?: number | undefined): number => insertRule(sheet, `@keyframes ${keyframes}{}`, index)

// appendRule wont return the index 
export const insertKeyframe = (sheet: CSSKeyframesRule, keyText: string | number | Array<string | number>) => sheet.appendRule(`${normalizeKeyText(keyText)}{}`)

export const deleteRule = (sheet: CSSStyleSheet, index: number) => sheet.deleteRule(index)

export const deleteKeyframe = (keyframes: CSSKeyframesRule, keyText: string | number) => keyframes.deleteRule(normalizeKeyText(keyText))

// update
export const setSelector = (styleRule: CSSStyleRule, selector: string) => styleRule.selectorText = selector
export const setKeyframesName = (keyframes: CSSKeyframesRule, name: string) => keyframes.name = name

export const setStyleProperty = (style: CSSStyleDeclaration, property: string, value: string, important: boolean = false) => style.setProperty(hyphenate(property), value, important ? IMPORTANT : '')


