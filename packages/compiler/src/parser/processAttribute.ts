
import { Nodes, nodeTypeOf } from '@crush/types'
import {
    AstNode,
} from './parseNode'

import {
    HTMLAttribute
} from './parseHTML'

import {
    camelize,
    makeMap
} from '@crush/common'

var exDynamicAttr = /(@|$|-{2})?\(([^\)]+)\)(?::(\w+))?(?:\.([\w\.]+))?/

// not allow to use ( ) for dynamic property

const isCompileDir = makeMap('for,slot,slotDef')

const isConditionalBranch = makeMap('if,elseIf,else')

var exDirective = /([^:.]+)(?::(\w+))?(?:\.([\w\.]+))?/

export const processAttribute = (node: AstNode) => {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
        case Nodes.FOR:
        case Nodes.HTML_ELEMENT:
            break
    }
}

