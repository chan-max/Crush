
import {
    parseHTML
} from './parseHTML'

import {
    isArray, throwError
} from '@crush/common'

import {
    camelize
} from '@crush/common'

import {
    Nodes,
    tagTypeOf
} from '@crush/types'

import {
    parseText,
    Text
} from './parseText'

import {
    parseIterator
} from './parseIterator'

import {
    parseCSS
} from './parseCSS'
import {
    findValueByattribute,
    processAttribute
} from './processAttribute'

import {
    processRules
} from './processRules'

import {
    warn
} from '@crush/common'
import { Asb } from './ast'

type ParseContext = {
    ignoreChildren: boolean // shoudle parse the children
}

export const parseTemplate = (template: string) => {
    var htmlAst = parseHTML(template)
    parseNodes(htmlAst)
    return htmlAst
}

const parseNodes = (
    nodes: Asb[],
    ctx: ParseContext = {
        ignoreChildren: false,
    }) => {
    nodes.forEach((node) => {
        parseNode(node, ctx)
        if (isArray(node.children) && !ctx.ignoreChildren) {
            parseNodes(node.children as Asb[], ctx)
        }
        // reset status
        ctx.ignoreChildren = false
    })
}

function parseNode(node: Asb, ctx: any) {
    const type = node.type
    if (type === Nodes.DOM_ELEMENT) {
        const tagType = tagTypeOf(node.tagName as string)
        node.type = tagType
        switch (tagType) {
            case Nodes.HTML_ELEMENT:
                processAttribute(node)
                break
            case Nodes.SVG_ELEMENT:
                break
            case Nodes.COMPONENT:
                processAttribute(node)
                break
            case Nodes.STYLE:
                var template = node.children?.[0].children
                if (template) {
                    var styleAst = parseCSS(template)
                    console.log('styleAst', styleAst);
                    processRules(styleAst)
                    node.children = styleAst
                    ctx.ignoreChildren = true
                }
                return
            case Nodes.IF:
                node.condition = node.attributeMap['condition']
                node.isBranchStart = true
                break
            case Nodes.ELSE_IF:
                node.condition = node?.attributeMap?.['condition']
                node.isBranch = true
                break
            case Nodes.ELSE:
                node.isBranch = true
                break
            case Nodes.FOR:
                node.iterator = parseIterator(node.attributeMap['iterator'])
                break
        }
    } else if (type === Nodes.TEXT) {
        node.children = parseText(node.children as string)
        ctx.ignoreChildren = true
        return
    } else if (type === Nodes.HTML_COMMENT) {
        // todo
    }
}