
import { Nodes } from "../../node/nodes"

export const updateStyleSheet = (p: any, n: any) => {
    var ref = n.ref = p.ref
    var sheet = ref.sheet
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
import { mountStyleRule } from "./mountStyleSheet"

import {
    diffChildren
} from './sequence'

import {
    mountRule
} from './mountStyleSheet'

function updateSheet(pRules: any, nRules: any, sheet: CSSStyleSheet | CSSMediaRule, vnode: any) {
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey  
        patchkey 作为第一优先级
        其次为nodetype,
        !还是假设key相同的节点顺序一定不会变，
    */
    var {
        p, n
    } = diffChildren(pRules, nRules, true)

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
            sheet.deleteRule(cursor)
            cursor--
        } else if (pRule.nodeType !== nRule.nodeType) {
            // 当节点类型不同时，先卸载，再挂载 
            sheet.deleteRule(cursor)
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
                    // supports cant update , 
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
    var ref: CSSStyleRule = nRule.ref = pRule.ref
    var { selector: pSelector, children: pDeclaration } = pRule
    var { selector: nSelector, children: nDeclaration } = nRule
    if (pSelector !== nSelector) {
        ref.selectorText = nSelector
    }
    var style = ref.style
    updateDeclaration(pDeclaration, nDeclaration, style, vnode)
}

function updateMediaRule(pRule: any, nRule: any, vnode: any) {
    var ref: CSSMediaRule = nRule.ref = pRule.ref
    var { media: pMedia, children: pRules } = pRule
    var { media: nMedia, children: nRules } = nRule

    /* while not the same media condition */
    if (pMedia !== nMedia) {
        debugger
    }

    updateSheet(pRules, nRules, ref, vnode)
}




import { mountKeyframeRule } from './mountStyleSheet'
import { normalizeKeyframe } from './common'

function updateKeyframesRule(pRule: any, nRule: any, vnode: any) {
    var keyframesRef: CSSKeyframesRule = nRule.ref = pRule.ref
    var { keyframes: pKeyframes, children: pRules } = pRule
    var { keyframes: nKeyframes, children: nRules } = nRule

    if (pKeyframes !== nKeyframes) {
        keyframesRef.name = nKeyframes
    }

    var maxLength = Math.max(pRules.length, nRules.length)

    /*
        最简单的更新策略，只存在keyframe，并且可以设置keyText
    */
    for (let i = 0; i < maxLength; i++) {
        var pk = pRules[i]
        var nk = nRules[i]
        if (!pk) {
            mountKeyframeRule(keyframesRef, nk, vnode)
        } else if (!nk) {
            keyframesRef.deleteRule(normalizeKeyframe(pk.keyframe))
        } else {
            var { keyframe: pKeyframe, children: pDeclaration } = pk
            var { keyframe: nKeyframe, children: nDeclaration } = nk
            let keyframeRef = nk.ref = pk.ref
            var style = keyframeRef.style
            if (pKeyframe !== nKeyframe) {
                keyframeRef.keyText = nKeyframe
            }
            updateDeclaration(pDeclaration, nDeclaration, style, vnode)
        }
        // 不存在两个都没有的情况
    }
}