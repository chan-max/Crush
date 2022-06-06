
import { Nodes } from "@crush/const"

export const updateStyleSheet = (p: any, n: any) => {
    var el = n.el = p.el
    var sheet = el.sheet
    /*
        更新style元素的props，并且处理特殊属性如，unit,url 等
    */
    updateSheet(p.children, n.children, sheet, n)
}

/*
    selector 
    media could be updated by mediaList , appendMedium and deleteMedium
*/

import { updateDeclaration } from "./declaration"

import {
    diffChildren
} from './sequence'

import {
    mountRule
} from './mountStyleSheet'

function updateSheet(pRules: any, nRules: any, sheet: any, vnode: any) {
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey  
        patchkey 作为第一优先级
        其次为nodetype,
        !还是假设key相同的节点顺序一定不会变，
    */
    var { p, n } = diffChildren(pRules, nRules, true)

    /* 
        经过第一次处理后，还需要进行第二次处理，目的是只有nodeType类型相同的节点会属于相同的节点，其他一律用空节点代替，因为一定会挂载或卸载，
        抛出同一索引下节点类型不相同的情况      
    */

    var max = Math.max(p.length, n.length)

    var cursor = 0
    for (let i = 0; i < max; i++) {
        var pRule = p[i]
        var nRule = n[i]
        /*
            不存在两个对应位置都为空的情况
        */
        if (!pRule) {
            mountRule(sheet, nRule, vnode, cursor)
            cursor++
        } else if (!nRule) {
            // unmount
            deleteRule(sheet, cursor)
            cursor--
        } else if (pRule.nodeType !== nRule.nodeType) {
            // 当节点类型不同时，先卸载，再挂载 
            deleteRule(sheet, cursor)
            mountRule(sheet, nRule, vnode, cursor)
        } else {
            // update
            switch (nRule.nodeType) {
                case Nodes.STYLE_RULE:
                    updateStyleRule(pRule, nRule, vnode)
                    break
                case Nodes.MEDIA_RULE:
                    updateMediaRule(pRule, nRule, vnode)
                    break
                case Nodes.SUPPORTS_RULE:
                    // supports can't update 
                    deleteRule(sheet, cursor)
                    mountRule(sheet, nRule, vnode, cursor)
                    break
                case Nodes.KEYFRAMES_RULE:
                    updateKeyframesRule(pRule, nRule, vnode)
                    break
            }
        }
        cursor++
    }
}


function updateStyleRule(pRule: any, nRule: any, vnode: any) {
    var rule: CSSStyleRule = nRule.rule = pRule.rule
    debugger
    var style = rule.style

    if (!style) return
    var { selector: pSelector, children: pDeclaration } = pRule
    var { selector: nSelector, children: nDeclaration } = nRule
    if (pSelector !== nSelector) {
        setSelector(rule, nSelector)
    }
    updateDeclaration(style, pDeclaration, nDeclaration)
}


// same as selector delimiter
const mediumDelimiter = /\s*,\s*/
const normalizeMedium = (medium: string | string[]) => isArray(medium) ? medium : medium.trim().split(mediumDelimiter)

function updateMedium(mediaRule: CSSMediaRule, pMediaum: string | string[], nMediaum: string | string[]) {
    pMediaum = normalizeMedium(pMediaum)
    nMediaum = normalizeMedium(nMediaum)
    pMediaum.forEach((m: string) => {
        if (!nMediaum.includes(m)) {
            deleteMedium(mediaRule, m)
        }
    })
    nMediaum.forEach((m: string) => {
        if (!pMediaum.includes(m)) {
            appendMedium(mediaRule, m)
        }
    })
}

function updateMediaRule(pRule: any, nRule: any, vnode: any) {
    var rule: CSSMediaRule = nRule.rule = pRule.rule
    var { media: pMedia, children: pRules } = pRule
    var { media: nMedia, children: nRules } = nRule
    updateMedium(rule, pMedia, nMedia)
    updateSheet(pRules, nRules, rule, vnode)
}




import { mountKeyframeRule } from './mountStyleSheet'
import { deleteKeyframe, deleteRule, setKeyframesName, setKeyText, appendMedium, deleteMedium, setSelector } from '../style'
import { isArray, isString } from "@crush/common"

function updateKeyframesRule(pRule: any, nRule: any, vnode: any) {
    var keyframesrule: CSSKeyframesRule = nRule.rule = pRule.rule
    var { keyframes: pKeyframes, children: pRules } = pRule
    var { keyframes: nKeyframes, children: nRules } = nRule

    if (pKeyframes !== nKeyframes) {
        setKeyframesName(keyframesrule, nKeyframes)
    }

    var maxLength = Math.max(pRules.length, nRules.length)

    /*
        最简单的更新策略，只存在keyframe，并且可以设置keyText
    */
    for (let i = 0; i < maxLength; i++) {
        var pk = pRules[i]
        var nk = nRules[i]
        if (!pk) {
            mountKeyframeRule(keyframesrule, nk, vnode)
        } else if (!nk) {
            deleteKeyframe(keyframesrule, pk.keyframe)
        } else {
            var { keyframe: pKeyframe, children: pDeclaration } = pk
            var { keyframe: nKeyframe, children: nDeclaration } = nk
            let keyframerule = nk.rule = pk.rule
            var style = keyframerule.style
            if (pKeyframe !== nKeyframe) {
                setKeyText(keyframerule, nKeyframe)
            }
            updateDeclaration(style, pDeclaration, nDeclaration)
        }
        // 不存在两个都没有的情况
    }
}