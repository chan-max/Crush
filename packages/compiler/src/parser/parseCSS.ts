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
    warn, error
} from '@crush/common'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/
const CSSCommentRE = /\/\*([\s\S]*?)\*\//
const CSSDir = /^--([\w-]+)\s*(?:\(([^{]*)\))?\s*{/
const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinEx = /\.\.\.([^;]+);/

import {
    Nodes, NodesMap
} from '@crush/types'

export type CSSNode = {
    type: Nodes,
    children?: CSSNode[],
    parent?: CSSNode,
    selectors?: any
    content?: string | Selector | Declaration[],
    dirs?: any[]
}



export const parseCSS = (source: string): CSSNode[] => {
    var scanner = createScanner(source)
    var ast: CSSNode[] = [],
        exResult: any,
        stack: CSSNode[] = [],
        currentRule: any,
        parent = null

    while (scanner.source) {
        if (scanner.startsWith(NodesMap[Nodes.AT_RULE])) {
            var [type, content]: [Nodes, any] = scanner.exec(AtRule)
            currentRule = { type: NodesMap[type], content }
        } else if (scanner.startsWith(NodesMap[Nodes.DIRECTIVE_FLAG])) {
            var [dir, content] = scanner.exec(CSSDir)
            currentRule = { type: NodesMap[dir], content }
        } else if (scanner.expect('}')) {
            stack.pop()
            parent = stack[stack.length - 1]
            scanner.move(1)
            continue
        } else if (scanner.expect('/*')) {
            /* comment continue */
        } else if (scanner.startsWith(NodesMap[Nodes.MIXIN])) {
            var [content] = scanner.exec(mixinEx);
            (parent.children ||= []).push({
                type: Nodes.MIXIN,
                content,
                parent
            })
            continue
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
            var declaration = parseDeclaration(exResult[0], exResult[1]);
            if (!parent) {
                //error
            } else {
                var children = parent.children ||= []
                var lastChild = children[children.length - 1]
                if (lastChild?.type === Nodes.DECLARATION) {
                    lastChild.content.push(declaration)
                } else {
                    children.push({
                        type: Nodes.DECLARATION,
                        content: [declaration],
                        parent
                    })
                }
            }
            continue
        } else {
            /* error */
        }

        /* process the relation , with cascading struct */

        if (!parent) {
            // while there is no parent , the currentDeclaration is meaningless
            ast.push(currentRule)
        } else {
            (parent.children ||= []).push(currentRule);
            currentRule.parent = parent
        }

        stack.push(currentRule);
        parent = currentRule
    }
    return ast
}