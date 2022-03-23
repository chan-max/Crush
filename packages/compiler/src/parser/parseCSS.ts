import {
    createScanner
} from './scanner'
import {
    scopedExp
} from '../helper/scopedExp'

import {
    parseSelector, Selector
} from './parseSelector'

import {
    parseDeclaration,
    Declaration
} from './parseDeclaration'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/
const CSSCommentRE = /\/\*([\s\S]*?)\*\//
const CSSDir = /^--([\w]+)\s*(?:\(([^{]*)\))?\s*{/
const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinEx = /\.\.\.([^;]+);/

import {
    Nodes, NodesMap
} from '@crush/types'

export type CSSNode = {
    type: Nodes,
    children?: CSSNode[],
    parent?: CSSNode,
    content?: string | Selector | Declaration
}


export const parseCSS = (source: string): CSSNode[] => {
    var scanner = createScanner(source)
    var ast: CSSNode[] = [],
        exResult: any,
        stack: CSSNode[] = [],
        currentRule: any,
        shouldPush = true
    while (scanner.source) {
        if (scanner.startsWith(NodesMap[Nodes.AT_RULE])) {
            var [type, content]: [Nodes, any] = scanner.exec(AtRule)
            currentRule = { type, content }
        } else if (scanner.startsWith(NodesMap[Nodes.DIRECTIVE_FLAG])) {
            var [dir, content] = scanner.exec(CSSDir)
            /*  not ensure to parse , keep a suspense for the code generator */
            currentRule = { type: NodesMap[dir], content }
        } else if (scanner.expect('}')) {
            stack.pop()
            scanner.move(1)
            continue
        } else if (scanner.expect('/*')) {
            /* comment */
        } else if (scanner.startsWith(NodesMap[Nodes.MIXIN])) {
            var [content] = scanner.exec(mixinEx);
            currentRule = {
                type: Nodes.MIXIN,
                content
            }
            shouldPush = false
        } else if (exResult = scanner.exec(selectorRE)) {
            /*
                当不确定规则类型时，
                先尝试获取选择器，在获取样式声明
            */
            currentRule = {
                type: Nodes.STYLE_RULE,
                content: parseSelector(exResult[0])
            }
        } else if (exResult = scanner.exec(declarationRE)) {
            currentRule = {
                type: Nodes.DECLARATION,
                content: parseDeclaration(exResult[0], exResult[1])
            }
            shouldPush = false
        } else {
            /* error */
        }

        /* process the relation */ 
        var parent = stack[stack.length - 1]
        if (!parent) {
            ast.push(currentRule)
        } else {
            (parent.children ||= []).push(currentRule);
            currentRule.parent = parent
        }
        if (shouldPush) {
            stack.push(currentRule)
        }
        shouldPush = true
    }
    return ast
}