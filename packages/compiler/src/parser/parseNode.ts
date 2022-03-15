
import {
    parseHTML,
    HTMLNode,
    HTMLAttribute
} from './parseHTML'

import {
    isArray
} from '@crush/common'

import {
    camelize
} from '@crush/common'

import {
    NodeTypes,
    nodeTypeOf
} from '@crush/types'

import {
    parseText,
    Text
} from './parseText'

import {
    CSSNode,
    parseCSS
} from './parseCSS'
import {
    parseAttribute
} from './parseAttr'

import {
    parseIterator
} from './parseIterator'

import {
    warn
} from '@crush/common'

export type Dir = {
    type: NodeTypes.IF | NodeTypes.FOR | NodeTypes.ELSE_IF | NodeTypes.ELSE
    content: any
}

export type AstNode = Omit<HTMLNode, 'children'> & {
    type: NodeTypes
    tagName: string
    dir?: Dir[] | Dir

    children: Text[] | string | AstNode[] | CSSNode[]
}

type ParseContext = {
    ignoreChildren?: boolean // shoudle parse the children
}

export const parseNodes = (nodes: AstNode[], ctx: ParseContext = {}) => nodes.forEach((node) => {
    parseNode(node, ctx)
    if (isArray(node.children) && !ctx.ignoreChildren) { parseNodes(node.children as AstNode[], ctx) }
    ctx.ignoreChildren = false
})

function parseNode(node: AstNode, ctx: any) {
    node.tagName = camelize(node.tag)
    node.type = nodeTypeOf(node.tagName as string) as NodeTypes
    switch (node.type) {
        case NodeTypes.TEXT:
            node.children = parseText(node.children as string)
            ctx.ignoreChildren = true
            return
        case NodeTypes.STYLESHEET:
            /*
                special attrs
                unit , url ,
            */ 
            node.children = parseCSS(node.children as string)
            ctx.ignoreChildren = true
            return
        case NodeTypes.FOR:
        case NodeTypes.IF:
        case NodeTypes.HTML_COMMENT:
        case NodeTypes.SVG_ELEMENT:
        case NodeTypes.COMPONENT:
        case NodeTypes.HTML_ELEMENT:
            parseAttribute(node)
            break
    }
}