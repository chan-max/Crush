
import {
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
    Nodes,
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
    findAttrByName,
    processAttribute
} from './processAttribute'



import {
    warn
} from '@crush/common'

export type Dir = {
    type: Nodes
    content: any
}

export type AstNode = Omit<HTMLNode, 'children'> & {
    type: Nodes
    tagName: string
    dir?: Dir[]
    content: any
    children: Text[] | string | AstNode[] | CSSNode[]
}

type ParseContext = {
    ignoreChildren?: boolean // shoudle parse the children
    defaultType?: Nodes | null
}

export const parseNodes = (nodes: AstNode[], ctx: ParseContext = {}) => nodes.forEach((node) => {
    parseNode(node, ctx)
    if (isArray(node.children) && !ctx.ignoreChildren) {
        parseNodes(node.children as AstNode[], ctx)
    }
    // reset status
    ctx.ignoreChildren = false
    ctx.defaultType = null
})



function parseNode(node: AstNode, ctx: any) {
    node.tagName = camelize(node.tag)
    node.type = ctx.defaultType || nodeTypeOf(node.tagName as string) as Nodes
    switch (node.type) {
        case Nodes.TEXT:
            node.children = parseText(node.children as string)
            ctx.ignoreChildren = true
            return
        case Nodes.STYLESHEET:
            /*
                special attrs
                unit , url ,
            */
            node.children = parseCSS(node.children as string)
            ctx.ignoreChildren = true
        case Nodes.HTML_COMMENT:
        case Nodes.SVG_ELEMENT:
            ctx.defaultType = Nodes.SVG_ELEMENT
        case Nodes.COMPONENT:
        case Nodes.HTML_ELEMENT:
        case Nodes.FOR:
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            processAttribute(node)
    }
}