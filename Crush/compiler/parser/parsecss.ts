import {
    trimS
} from './utils'

import { Nodes } from '../../type/nodeType'
import { parseSelector } from './parseSelector'
import {
    parseDeclaration
} from './parseDeclaration'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/
const CSSCommentRE = /\/\*([\s\S]*?)\*\//
const CSSDirectiveRE = /^--([\w]+)\s*(?:\(([^{]+)\))?\s*{/
const AtRuleRE = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinRE = /\.\.\.([^;]+);/

export const parseCSS = (cs: string) => {
    var ast: any = [],
        stack: any = [],
        sl = 0,
        $: any,
        currentRule: any
    while (cs = trimS(cs, sl)) {
        if (cs[0] === '@') {
            $ = AtRuleRE.exec(cs)
            switch ($[1]) {
                case 'media':
                    currentRule = {
                        nodeType: Nodes.MEDIARULE,
                        mediaCondition: $[2],
                        children: [],
                        declaration: []
                    }
                    break
                case 'keyframes':
                    currentRule = {
                        nodeType: Nodes.KEYFRAMESRULE,
                        keyframesName: $[2],
                        children: [],
                        declaration: []
                    }
                    break
            }
        } else if (cs.startsWith('~')) {
            $ = CSSDirectiveRE.exec(cs)
        } else if (cs.startsWith('...')) {
            $ = mixinRE.exec(cs)
            stack[stack.length - 1].declaration.push({
                nodeType: Nodes.MIXIN,
                mixin: $[1]
            })
            sl = $[0].length
            continue
        } else if (cs.startsWith('/*')) {
            $ = CSSCommentRE.exec($[0])
        } else if ($ = selectorRE.exec(cs)) {
            currentRule = {
                nodeType: Nodes.STYLERULE,
                selector: parseSelector($[1]),
                children: [],
                declaration: []
            }
        } else if (cs[0] === '}') {
            stack.pop()
            sl = 1
            continue
        } else if ($ = declarationRE.exec(cs)) {
            stack[stack.length - 1].declaration.push(parseDeclaration($[1], $[2]))
            sl = $[0].length
            continue
        }
        var parent = stack[stack.length - 1]
        if (!parent) {
            ast.push(currentRule)
        } else {
            parent.children.push(currentRule)
            currentRule.parent = parent
        }
        stack.push(currentRule)
        sl = $[0].length
    }
    return ast
}
