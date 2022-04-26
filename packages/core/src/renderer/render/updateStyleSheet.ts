import { removeFromArray } from "@crush/common"
import { Nodes } from "@crush/types"

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

function createMapAndList(children: any[]) {
    var map: any = {}
    var list = children.map((child: any, index: number) => {
        var patchKey = child.patchKey
        var token = {
            node: child,
            patchKey,
            index
        }
        map[patchKey] = token
        return token
    })
    return {
        map, list
    }
}

import {
    insertNull
} from './common'
import { getDeclarationValue } from "./declaration"
import { mountStyleRule } from "./mountStyleSheet"
import { nodeOps } from "./nodeOps"

function updateSheet(p: any, n: any, sheet: CSSStyleSheet | CSSMediaRule, vnode: any) {
    /*
        与更新dom元素不同，规则中只要patchKey相同就一定会复用,
        更新过程依赖patchkey  
        patchkey 作为第一优先级
        其次为nodetype,
        !还是假设key相同的节点顺序一定不会变，
    */
    var pLength = p.length
    var nLength = n.length
    var { map: pMap, list: pList } = createMapAndList(p)
    var { map: nMap, list: nList } = createMapAndList(n)

    var pMoved = 0

    for (let i = 0; i < nLength; i++) {
        /*
            此次循环用于将两组规则的相同key对应到相同的索引下
        */

        var node = n[i]
        var patchKey = node.patchKey
        var sameNode = pMap[patchKey]
        if (sameNode) {
            // 存在key相同的节点
            var sameNodeIndex = sameNode.index + pMoved
            var diff = i - sameNodeIndex
            var diffLength = Math.abs(diff)
            if (diff < 0) {
                /* 说明该接点在p中的位置较远，需要再n中条南充元素 */
                insertNull(n, i, diffLength)
                i += diffLength
                nLength += diffLength
            } else {
                insertNull(p, sameNodeIndex, diffLength)
                pMoved += diffLength
            }
        }
    }

    /* 
        经过第一次处理后，还需要进行第二次处理，目的是只有nodeType类型相同的节点会属于相同的节点，其他一律用空节点代替，因为一定会挂载或卸载，
        抛出同一索引下节点类型不相同的情况      
    */

    var maxLength = Math.max(p.length, n.length)

    for (let i = 0; i < maxLength; i++) {
        var pRule = p[i]
        var nRule = n[i]
        /*
            不存在两个对应位置都为空的情况
        */
        if (!pRule) {
            mountStyleRule(sheet, nRule, vnode)
        } else if (!nRule) {
            sheet.deleteRule(i)
        } else if (pRule.nodeType !== nRule.nodeType) {
            // 当节点类型不同时，先卸载，再挂载
            sheet.deleteRule(i)
            switch (nRule.nodeType) {
                case Nodes.STYLE_RULE:
                    mountStyleRule(sheet, nRule, vnode)
                    break
            }
        } else {
            // update
            switch (nRule.nodeType) {
                case Nodes.STYLE_RULE:
                    updateStyleRule(pRule, nRule, vnode)
                    break
                case Nodes.MEDIA_RULE:
                    updateMediaRule(pRule, nRule, vnode)
                    break
            }
        }
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
    var delList = Object.keys(pDeclaration)

    for (let property in nDeclaration) {
        var { value: pValue, important: pImportant } = getDeclarationValue(pDeclaration[property])
        var { value: nValue, important: nImportant } = getDeclarationValue(nDeclaration[property])
        if (pValue !== nValue || pImportant !== nImportant) { /* 当属性值不同并且important不同时均需要更新 */
            nodeOps.setProperty(style, property, nValue, nImportant)
        }
        removeFromArray(delList, property)
    }
    delList.forEach((property: string) => nodeOps.setProperty(style, property, '')) // 清空旧的属性
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