
/*
    mountStyleSheet will create a style element
*/

import { isString } from "@crush/common"
import { hyphenate } from "@crush/common/src/transformString"
import { Nodes } from "@crush/types"

export const mountStyleSheet = (vnode: any, container: any) => {
    var el = document.createElement('style')
    vnode.el = el
    container.appendChild(el)
    var sheet = el.sheet
    const rules = vnode.children
    mountSheet(sheet, rules, vnode)
}

function mountSheet(sheet: any, rules: any, vnode: any) {
    rules.forEach((rule: any) => {
        switch (rule.nodeType) {
            case Nodes.STYLE_RULE:
                mountStyleRule(sheet, rule, vnode)
                break
            case Nodes.MEDIA_RULE:
                mountMediaRule(sheet, rule, vnode)
                break
        }
    })
}

import {
    IMPORTANT_SYMBOL,
    IMPORTANT_KEY,
    IMPORTANT
} from '../common/important'

function getDeclarationValue(rawValue: any) {
    var value, important
    if (rawValue[IMPORTANT_SYMBOL]) {
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

function mountStyleRule(sheet: any, rule: any, vnode: any) {
    const {
        selector,
        children: declaration // rename
    } = rule
    if (!declaration) return
    const index = sheet.insertRule(`${selector}{}`, sheet.cssRules.length)
    const insertedRule = sheet.cssRules[index]
    const insertedRuleStyle = insertedRule.style
    Object.entries(declaration).forEach(([key, value]: [any, any]) => {
        key = hyphenate(key) // the property shoule be uncamelized
        var {
            value,
            important
        } = getDeclarationValue(value)
        insertedRuleStyle.setProperty(key, value, important ? IMPORTANT : '')
    })
}

function mountMediaRule(sheet: any, rule: any, vnode: any) {
    var media = rule.media
    var rules = rule.children
    var index = sheet.insertRule(`@media ${media}{}`, sheet.cssRules.length)
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}