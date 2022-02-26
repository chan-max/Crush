import {
    createScanner
} from './scanner'

import { Nodes } from '../../type/nodeType'
import { parseSelector } from './parseSelector'
import {
    parseDeclaration
} from './parseDeclaration'
import {
    parseIterator
} from './parseIterator'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/
const CSSCommentRE = /\/\*([\s\S]*?)\*\//
const CSSDir = /^--([\w]+)\s*(?:\(([^{]*)\))?\s*{/
const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinEx = /\.\.\.([^;]+);/

export const parseCSS = (source) => {
    var scanner = createScanner(source)
    var ast: any = [],
        $: any,
        stack: any = [],
        currentRule: any,
        shouldPush = true
    while (scanner.source) {
        if (scanner.expect('@')) {
            var [type, content] = scanner.extract(AtRule)
            switch (type) {
                case 'media':
                    currentRule = {
                        nodeType: Nodes.MEDIARULE,
                        mediaCondition: content,
                    }
                    break
                case 'keyframes':
                    currentRule = {
                        nodeType: Nodes.KEYFRAMESRULE,
                        keyframesName: content,
                    }
                    break
                case 'support':
                    currentRule = {
                        nodeType: Nodes.SUPPORTRULE,
                        support: content,
                    }
                    break
            }
        } else if (scanner.expect('--')) {
            var [dir, exp] = scanner.extract(CSSDir)
            if (dir === 'if') {
                currentRule = {
                    nodeType: Nodes.IF,
                    condition: exp
                }
            } else if (dir === 'for') {
                currentRule = {
                    nodeType: Nodes.FOR,
                    iterator: parseIterator(exp)
                }
            } else if (dir === 'switch') {

            } else if (dir === 'case') {

            }
        } else if (scanner.expect('}')) {
            stack.pop()
            scanner.move(1)
            currentRule = stack[stack.length - 1]
            continue
        } else if (scanner.expect('/*')) {
            /* comment */
        } else if (scanner.expect('...')) {
            var [mixin] = scanner.extract(mixinEx);
            currentRule = {
                nodeType: Nodes.MIXIN,
                mixin
            }
            shouldPush = false
        } else if ($ = scanner.extract(selectorRE)) {
            /*
                当不确定规则类型时，
                先尝试获取选择器，在获取样式声明
            */
            currentRule = {
                nodeType: Nodes.STYLERULE,
                selector: parseSelector($[0]),
            }
        } else if ($ = scanner.extract(declarationRE)) {
            currentRule = parseDeclaration($[0], $[1])
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