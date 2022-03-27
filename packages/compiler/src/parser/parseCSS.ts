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
    warn, error, camelize
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


import {
    Asb,
    createAsb
} from './ast'

export const parseCSS = (source: string): Asb[] => {
    var scanner = createScanner(source)
    var ast: Asb[] = [],
        stack: Asb[] = [],
        exResult: any,
        current: any,
        parent = null,
        closing = false,
        declarations: any
    while (scanner.source) {
        if (scanner.startsWith('}')) {
            closing = true
        } else if (scanner.startsWith(NodesMap[Nodes.AT])) {
            /*
                media conditions
            */
            var [type, content]: [Nodes, any] = scanner.exec(AtRule)
            current = createAsb(NodesMap[type], content)
        } else if (scanner.startsWith(NodesMap[Nodes.DIRECTIVE_FLAG])) {
            var [dir, content] = scanner.exec(CSSDir)
            current = createAsb(NodesMap[camelize(dir)], content)
        } else if (scanner.expect('/*')) {
            /* comment continue */
        } else if (scanner.startsWith(NodesMap[Nodes.MIXIN])) {
            var [content] = scanner.exec(mixinEx);
            (declarations ||= []).push(createAsb(Nodes.MIXIN, content))
            continue
        } else if (exResult = scanner.exec(selectorRE)) {
            current = createAsb(Nodes.STYLE_RULE, parseSelector(exResult[0]))
        } else if (exResult = scanner.exec(declarationRE)) {
            /*
                the last declaration must end with  " ; "
            */
            var declaration = parseDeclaration(exResult[0], exResult[1]);
            (declarations ||= []).push(createAsb(Nodes.DECLARATION, declaration))
            continue
        } else {
            /* error */
            debugger
        }

        /* process the relation , with cascading struct */

        if (declarations) {
            (parent.children ||= []).push(createAsb(Nodes.DECLARATIONS, declarations,parent))
            declarations = null
        }

        if (closing) {
            stack.pop()
            parent = stack[stack.length - 1]
            scanner.move(1)
            closing = false
            continue
        }

        if (!parent) {
            // while there is no parent , the currentDeclaration is meaningless
            ast.push(current)
        } else {
            var children = parent.children ||= [];
            current.parent = parent
            children.push(current)
        }
        stack.push(current);
        parent = current
    }
    return ast
}
