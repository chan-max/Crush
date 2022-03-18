
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
    ignoreChildren: boolean // shoudle parse the children
    defaultType: Nodes | null
}


/*
    find the value of attribute list
*/
function findAttr(
    attrs: HTMLAttribute[],
    validator: Function, // to decide a value is legal by attribute 
    getAll: boolean // should get all value 
) {
    var res: any
    for (let i = 0; i < attrs.length; i++) {
        var attr = attrs[i]
        if (validator(attr.attribute)) {
            if (getAll) {
                res ||= [];
                res.push(attr.value)
            } else {
                res = attr.value
                break
            }
        }
    }
    return res
}

const findValueByattribute = (attrs: HTMLAttribute[], attribute: string) => findAttr(attrs, (_attribute: string) => _attribute === attribute, false)
const findValueByattributes = (attrs: HTMLAttribute[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), false)
const findValuesByattribute = (attrs: HTMLAttribute[], attributes: string) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), true)
const findValuesByattributes = (attrs: HTMLAttribute[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), true)

export const parseNodes = (
    nodes: AstNode[],
    ctx: ParseContext = {
        ignoreChildren: false,
        defaultType: null
    }) => nodes.forEach((node) => {
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
        case Nodes.STYLE:
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
            node.content = findValueByattribute(node.attributes as HTMLAttribute[], '--')
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            processAttribute(node)
    }
}