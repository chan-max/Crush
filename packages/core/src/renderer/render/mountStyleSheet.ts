
/*
    mountStyleSheet will create a style element
*/

import { isArray, isNumber, isString } from "@crush/common"
import { hyphenate } from "@crush/common/src/transformString"
import { Nodes } from "../../node/nodes"

export const mountStyleSheet = (vnode: any, container: any) => {
    var ref = document.createElement('style')
    vnode.ref = ref
    container.appendChild(ref)
    var sheet = ref.sheet
    const rules = vnode.children
    mountSheet(sheet, rules, vnode)
}

function mountSheet(sheet: any, rules: any, vnode: any) {
    rules.forEach((rule: any) => {
        mountRule(sheet, rule, vnode)
    })
}

export function mountRule(sheet: any, rule: any, vnode: any, index: number = sheet.cssRules.length) {
    switch (rule.type) {
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
    IMPORTANT
} from '../common/important'

import {
    getDeclarationValue,
    mountDeclaration
} from './declaration'
import { nodeOps } from "./nodeOps"

export function mountStyleRule(
    sheet: any,
    rule: any,
    vnode: any, // this is style vnode, it carry the special attrs for rendering
    insertIndex = sheet.cssRules.length
) {
    const {
        selector,
        children: declaration // rename
    } = rule
    if (!declaration) return
    const index = sheet.insertRule(`${selector}{}`, insertIndex)
    const insertedRule = sheet.cssRules[index]
    rule.ref = insertedRule // set ref
    const insertedRuleStyle = insertedRule.style
    mountDeclaration(declaration, insertedRuleStyle, vnode)
}

function mountMediaRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var media = rule.media
    var rules = rule.children
    var index = sheet.insertRule(`@media ${media}{}`, insertIndex)
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}

function mountSupportsRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var supports = rule.supports
    var rules = rule.children
    var index = sheet.insertRule(`@supports ${supports}{}`, insertIndex)
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}

function mountKeyframesRule(sheet: any, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var keyframes = rule.keyframes
    var rules = rule.children
    var index = sheet.insertRule(`@keyframes ${keyframes}{}`, insertIndex)
    rule.ref = sheet.cssRules[insertIndex]
    var newSheet = sheet.cssRules[index]
    mountSheet(newSheet, rules, vnode)
}


function normalizeKeyframe(keyframe: string | number | Array<string | number>): any {
    if (isArray(keyframe)) {
        return keyframe.map(normalizeKeyframe).join(',')
    } else if (isNumber(Number(keyframe))) {
        // 为数字或者数字字符串
        return `${keyframe}%`
    } else {
        return keyframe
    }
}

export function mountKeyframeRule(sheet: CSSKeyframesRule, rule: any, vnode: any, insertIndex: number = sheet.cssRules.length) {
    var { keyframe, children: declaration } = rule

    keyframe = normalizeKeyframe(keyframe)

    // appendRule wont return the index 
    sheet.appendRule(`${keyframe}{}`)
    var index = sheet.cssRules.length - 1
    const insertedRule: any = sheet.cssRules[index]
    rule.ref = insertedRule // set ref
    const insertedRuleStyle = insertedRule.style

    for (let property in declaration) {
        property = hyphenate(property) // the property shoule be uncamelized
        var { value } = getDeclarationValue(declaration[property])
        // keyframe 中不能设置important
        nodeOps.setProperty(insertedRuleStyle, property, value)
    }
}