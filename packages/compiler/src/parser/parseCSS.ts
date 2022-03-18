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

import {
    Nodes,
    nodeTypeMap
} from '@crush/types'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/
const CSSCommentRE = /\/\*([\s\S]*?)\*\//
const CSSDir = /^--([\w]+)\s*(?:\(([^{]*)\))?\s*{/
const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinEx = /\.\.\.([^;]+);/

export type CSSNode = {
    type: Nodes,
    children?: CSSNode[],
    parent?: CSSNode,
    content?: string | Selector | Declaration
}

export const parseCSS = (source: string): CSSNode[] => {
    var scanner = createScanner(source)
    var ast: CSSNode[] = [],
        $: any,
        stack: CSSNode[] = [],
        currentRule: any,
        shouldPush = true
    while (scanner.source) {
        if (scanner.startsWith(Nodes.AT_RULE)) {
            var [type, content]: [Nodes, any] = scanner.exec(AtRule)
            currentRule = { type, content }
        } else if (scanner.startsWith(Nodes.COMMON_DIR)) {
            var [dir, content] = scanner.exec(CSSDir)
            /*  not ensure to parse , keep a suspense for the code generator */
            currentRule = {
                type: nodeTypeMap[dir],
                content
            }
        } else if (scanner.expect('}')) {
            stack.pop()
            scanner.move(1)
            continue
        } else if (scanner.expect('/*')) {
            /* comment */
        } else if (scanner.expect('...')) {
            var [content] = scanner.exec(mixinEx);
            currentRule = {
                type: Nodes.MIXIN,
                content
            }
            shouldPush = false
        } else if ($ = scanner.exec(selectorRE)) {
            /*
                当不确定规则类型时，
                先尝试获取选择器，在获取样式声明
            */
            currentRule = {
                type: Nodes.STYLE_RULE,
                content: parseSelector($[0])
            }
        } else if ($ = scanner.exec(declarationRE)) {
            currentRule = {
                type: Nodes.DECLARATION,
                content: parseDeclaration($[0], $[1])
            }
            shouldPush = false
        } else {
            /* error */
        }

        /*
            除了闭合，样式声明，mixin之外，都需要处理，所以提出通用，其他用continue
        */

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