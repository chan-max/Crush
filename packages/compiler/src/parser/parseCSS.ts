import {
    createScanner
} from './scanner'
import {
    scopedExp
} from '../shared/scopedExp'

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

const AtRule = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinEx = /\.\.\.([^;]+);/


const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/
/*
    判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
*/
const cssReservedWord = /^(if|else-if|else|for|elseIf)/

import {
    Nodes, NodesMap
} from '@crush/types'


import {
    Asb,
    createAsb
} from './ast'
import { parseIterator } from './parseIterator'


export const parseCSS = (source: string): Asb[] => {
    var scanner = createScanner(source)
    var ast: Asb[] = [],
        stack: Asb[] = [],
        exResult: any,
        current: any,
        parent = null,
        closing = false,
        declarationGroup: any
    while (scanner.source) {
        if (scanner.startsWith('}')) {
            closing = true
        } else if (scanner.startsWith(NodesMap[Nodes.AT])) {
            /*
                media conditions
            */
            var [type, content]: [NodesMap, any] = scanner.exec(AtRule)
            const nodeType: any = NodesMap[type]
            var asb = createAsb(nodeType)
            if (nodeType === Nodes.MEDIA_RULE) {
                asb.media = content
            } else if (nodeType === Nodes.KEYFRAMES_RULE) {
                asb.keyframes = content
            } else if (nodeType === Nodes.SUPPORT_RULE) {
                asb.support = content
            }
            current = asb
        } else if (scanner.expect('/*')) {
            /* comment continue */
        } else if (scanner.startsWith(NodesMap[Nodes.MIXIN])) {
            var [mixin] = scanner.exec(mixinEx);
            var asb = createAsb(Nodes.MIXIN);
            asb.mixin = mixin;
            (declarationGroup ||= []).push(asb)
            continue
        } else if (cssReservedWord.test(scanner.source)) {
            /* 
                处理指令，指令不再需要通过标识符去判断
            */
            var [dir, content] = scanner.exec(CSSDir)
            var dirType: any = NodesMap[camelize(dir)]
            var asb = createAsb(dirType)
            switch (dirType) {
                case Nodes.FOR:
                    asb.iterator = parseIterator(content)
                    break
                case Nodes.IF:
                    asb.condition = content
                    asb.isBranchStart = true
                    break
                case Nodes.ELSE_IF:
                    asb.condition = content
                    asb.isBranch = true
                    break
                case Nodes.ELSE:
                    asb.isBranch = true
                    break
            }
            current = asb
        } else if (exResult = scanner.exec(selectorRE)) {
            /*
                try to get the selector
            */
            var asb = createAsb(Nodes.STYLE_RULE)
            asb.selector = parseSelector(exResult[0])
            current = asb
        } else if (exResult = scanner.exec(declarationRE)) {
            /*
                the last declaration must end with  " ; "
            */
            var declaration = parseDeclaration(exResult[0], exResult[1]);
            var asb = createAsb(Nodes.DECLARATION);
            asb.declaration = declaration;
            (declarationGroup ||= []).push(asb)
            continue
        } else {
            /* error */
            debugger
        }

        /* process the relation , with cascading struct */

        if (declarationGroup) {
            var asb = createAsb(Nodes.DECLARATION_GROUP);
            asb.children = declarationGroup;
            asb.parent = parent;
            (parent.children ||= []).push(asb)
            declarationGroup = null
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
