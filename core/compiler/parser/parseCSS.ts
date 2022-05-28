
import {
    createScanner
} from './scanner'


import {
    parseSelector,
} from './parseSelector'

import {
    parseAttribute,
} from './parseAttribute'

import {
    camelize
} from '../../common/transformString'

const selectorRE = /^([^{};]*)(?<!\s)\s*{/
const declarationRE = /([$\w!-\]\[]+)\s*:\s*([^;]+);/

const CSSCommentRE = /\/\*([\s\S]*?)\*\//

const AtRuleRE = /^@([\w]+)\s*([^{]+)(?<!\s)\s*{/
const mixinRE = /\.\.\.([^;]+);/


const CSSDir = /^([\w-]+)\s*(?:\(([^{]*)\))?\s*{/
/*
    判断是否已保留字开头，来决定是否为指令，不需要再用 '--' 标识
*/
const cssReservedWord = /^(if|else-if|else|for|elseIf)/

import {
    keyOf,
    Nodes, NodesMap
} from '../../const/node'

import { parseIterator } from './parseIterator'


export const parseCSS = (source: string): any => {
    var scanner = createScanner(source)
    var ast: any = [],
        stack: any = [],
        exResult: any,
        current: any,
        parent = null,
        closing = false,
        declarationGroup: any
    while (scanner.source) {
        if (scanner.startsWith('}')) {
            closing = true
        } else if (scanner.startsWith(keyOf(Nodes.AT))) {
            /*
                media conditions
            */
            var [key, content]: any = scanner.exec(AtRuleRE)
            var type: any = NodesMap[key]
            current = {
                type
            }
            if (type === Nodes.MEDIA_RULE) {
                current.media = content
            } else if (type === Nodes.KEYFRAMES_RULE) {
                current.keyframes = content
            } else if (type === Nodes.SUPPORTS_RULE) {
                current.supports = content
            }
        } else if (scanner.expect('/*')) {
            /* comment continue */
        } else if (scanner.startsWith(keyOf(Nodes.MIXIN))) {
            var [mixin]:any = scanner.exec(mixinRE);
            var m = {
                type: Nodes.MIXIN,
                mixin
            };
            (declarationGroup ||= []).push(m)
            continue
        } else if (cssReservedWord.test(scanner.source)) {
            /* 
                处理指令，指令不再需要通过标识符去判断
            */
            var [dir, content]: any = scanner.exec(CSSDir)
            var type: any = keyOf(dir)
            var d: any = { type }
            switch (type) {
                case Nodes.FOR:
                    d.iterator = parseIterator(content)
                    break
                case Nodes.IF:
                    d.condition = content
                    d.isBranchStart = true
                    break
                case Nodes.ELSE_IF:
                    d.condition = content
                    d.isBranch = true
                    break
                case Nodes.ELSE:
                    d.isBranch = true
                    break
            }
            current = d
        } else if (exResult = scanner.exec(selectorRE)) {
            /*
                try to get the selector
            */
            current = {
                type: Nodes.STYLE_RULE,
                selector: parseSelector(exResult[0])
            }
        } else if (exResult = scanner.exec(declarationRE)) {
            /*
                the last declaration must end with  " ; "
            */
            var declaration:any = parseAttribute(exResult[0], exResult[1]);
            //! important
            declaration.isImportant = declaration.endFlag === '!';
            (declarationGroup ||= []).push({
                declaration,
                type: Nodes.DECLARATION
            })
            continue
        } else {
            /* error */
            debugger
        }

        /* process the relation , with cascading struct */

        if (declarationGroup) {
            var asb: any = { type: Nodes.DECLARATION_GROUP };
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
