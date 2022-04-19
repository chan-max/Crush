
/*
    mountStyleSheet will create a style element
*/

import { hyphenate } from "@crush/common/src/transformString"
import { Nodes } from "@crush/types"

export const mountStyleSheet = (vnode: any, container: any) => {
    var el = document.createElement('style')
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
        var _value, important
        if (value[IMPORTANT_SYMBOL]) {
            _value = value.value
            important = true
        } else {
            _value = value
            important = false
        }
        insertedRuleStyle.setProperty(key, _value, important ? IMPORTANT : '')
    })
}

function mountMediaRule(sheet: any, rule: any, vnode: any) {
    var media = rule.media
    var rules = rule.children
    var index = sheet.insertRule(`@media ${media}{}`,sheet.cssRules.length)
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}