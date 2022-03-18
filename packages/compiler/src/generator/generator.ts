
import { Nodes } from '@crush/types'
import {
    AstNode
} from '../parser/parseNode'
import {
    Source
} from './source'

import {
    ternaryExp,
    ternaryChains,
    dynamicMapKey,
    toBackQuotes,
    toTernaryExp,
    toArray,
    toString,
    objectStringify,
    toArrowFunction,
    callFn
} from './stringify'

import {
    scopedExp
} from '../helper/scopedExp'

import {
    Text
} from '../parser/parseText'

export const genNodes = (nodes: AstNode[]) => {

    var lastBranch = null

    nodes.forEach((node) => {
        
    })
}

function genChildren(nodes: AstNode[]) {

    var children = nodes.map((ast: any) => genNode(ast))
    return toArray(children)
}

function genNode(node: AstNode) {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as AstNode[])
        case Nodes.FOR:
            debugger
        case Nodes.HTML_ELEMENT:
            return callFn(
                Source.createElement,
                toString(node.tagName)
            )
        case Nodes.SVG_ELEMENT:
            return callFn(Source.createSVGElement)
        case Nodes.COMPONENT:
            return callFn(Source.createComponent)
        case Nodes.TEXT:
            return genText(node.children as Text[])
    }
}

const genFragment = (code: string) => callFn(Source.createFragment, code)

const genTextContent = (texts: Text[]) => {
    return texts.map((text: Text) => {
        return text.isDynamic ? callFn(Source.display, text.content) : toString(text.content)
    }).join('+')
}

const genText = (texts: Text[]) => {
    return callFn(
        Source.createText,
        genTextContent(texts)
    )
}

