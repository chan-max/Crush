import {
    createScanner
} from './scanner'
import {
    scopedExp
} from '../helpers/scopedExp'

import { Nodes } from '../../type/nodeType'
import { parseSelector } from './parseSelector'
import {
    parseDeclaration
} from './parseDeclaration'
import {
    parseIterator
} from './parseIterator'

import {
    typeMap
} from './shared'

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
            currentRule = {
                type: typeMap[type], content
            }
        } else if (scanner.expect('--')) {
            var [dir, value] = scanner.extract(CSSDir)
            /*  not ensure to parse , keep a suspense for the code generator */
            currentRule = {
                type: typeMap[dir],
                value
            }
        } else if (scanner.expect('}')) {
            stack.pop()
            scanner.move(1)
            continue
        } else if (scanner.expect('/*')) {
            /* comment */
        } else if (scanner.expect('...')) {
            var [mixin] = scanner.extract(mixinEx);
            currentRule = {
                type: Nodes.MIXIN,
                mixin
            }
            shouldPush = false
        } else if ($ = scanner.extract(selectorRE)) {
            /*
                当不确定规则类型时，
                先尝试获取选择器，在获取样式声明
            */
            currentRule = {
                type: Nodes.STYLERULE,
                selector: parseSelector($[0])
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