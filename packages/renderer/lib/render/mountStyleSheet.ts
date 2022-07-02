
/*
    mountStyleSheet will create a style element
*/

import { isArray, isNumber, isString, hyphenate } from "@crush/common"

import { Nodes } from "@crush/const"
import { docCreateElement, insertElement } from "../dom"

export const mountStyleSheet = (vnode: any, container: any, anchor: any, parent: any) => {
    const { props, children } = vnode
    var el: any = docCreateElement('style')
    mountAttributes(el, props, parent, false)
    vnode.el = el
    insertElement(el, container, anchor)
    var sheet = el.sheet
    mountSheet(sheet, children, vnode)
}

function mountSheet(sheet: CSSStyleSheet, rules: any, vnode: any) {
    rules.forEach((rule: any) => {
        mountRule(sheet, rule, vnode)
    })
}

export function mountRule(sheet: any, rule: any, vnode: any, index: number = sheet.cssRules.length) {
    switch (rule.nodeType) {
        case Nodes.STYLE_RULE:
            mountStyleRule(sheet, rule, vnode, index)
            break
        case Nodes.MEDIA_RULE:
            mountMediaRule(sheet, rule, vnode, index)
            break
        case Nodes.SUPPORTS_RULE:
            mountSupportsRule(sheet, rule, vnode, index)
            break
        case Nodes.KEYFRAMES_RULE:
            mountKeyframesRule(sheet, rule, vnode, index)
            break
        case Nodes.KEYFRAME_RULE:
            mountKeyframeRule(sheet, rule, vnode, index)
            break
    }
}


import {
    parseStyleValue,
    mountDeclaration
} from './declaration'
import { insertKeyframe, insertKeyframes, insertMedia, insertStyle, insertSupports, normalizeKeyText, setStyleProperty } from "../style"
import { mountAttributes } from "./attribute"

export function mountStyleRule(
    sheet: any,
    rule: any,
    vnode: any, // this is style vnode, it carry the special attrs for rendering
    insertIndex = sheet.cssRules.length
) {
    const {
        selector,
        children: declaration
    } = rule

    if (!declaration) return
    const index = insertStyle(sheet, selector, insertIndex)
    const insertedRule = sheet.cssRules[index]
    rule.rule = insertedRule // set rule
    const insertedRuleStyle = insertedRule.style
    mountDeclaration(insertedRuleStyle, declaration)
}

function mountMediaRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var media = rule.media
    var rules = rule.children

    if (isArray(media)) {
        media = media.join(',')
    }

    var index = insertMedia(sheet, media, insertIndex)
    var newSheet = sheet.cssRules[index]
    rule.rule = newSheet
    mountSheet(newSheet, rules, vnode)
}

function mountSupportsRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var supports = rule.supports
    var rules = rule.children
    var index = insertSupports(sheet, supports, insertIndex)
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}

function mountKeyframesRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var keyframes = rule.keyframes
    var rules = rule.children
    var index = insertKeyframes(sheet, keyframes, insertIndex)
    rule.rule = sheet.cssRules[insertIndex]
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}




export function mountKeyframeRule(sheet: CSSKeyframesRule, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var { keyframe, children: declaration } = rule

    insertKeyframe(sheet, keyframe)

    sheet.appendRule(`${keyframe}{}`)
    var index = sheet.cssRules.length - 1
    const insertedRule: any = sheet.cssRules[index]
    rule.rule = insertedRule // set rule
    const insertedRuleStyle = insertedRule.style

    for (let property in declaration) {
        var { value } = parseStyleValue(declaration[property])
        // keyframe 中不能设置important
        setStyleProperty(insertedRuleStyle, property, value)
    }
}