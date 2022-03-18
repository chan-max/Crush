
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

export const findAttrByName = (attrs: HTMLAttribute[], key: string) => {
    for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].attribute === key) {
            return attrs[i].value
        }
    }
}

const findAttrByNames = (attrs: HTMLAttribute[], names: string[]) => {
    for (let i = 0; i < attrs.length; i++) {
        if (names.includes(attrs[i].attribute)) {
            return attrs[i].value
        }
    }
}

var exDynamicAttr = /(@|$|-{2})?\(([^\)]+)\)(?::(\w+))?(?:\.([\w\.]+))?/

// not allow to use ( ) for dynamic property

const isCompileDir = makeMap('for,slot,slotDef')

const isConditionalBranch = makeMap('if,elseIf,else')

var exDirective = /([^:.]+)(?::(\w+))?(?:\.([\w\.]+))?/

export const processAttribute = (node: AstNode) => {
    switch (node.type) {
        case Nodes.IF:
            node.dir = [{
                type: Nodes.IF,
                content: findAttrByName(node.attributes as HTMLAttribute[], '--')
            }]
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
        case Nodes.FOR:
        case Nodes.HTML_ELEMENT:

            break
    }
}

