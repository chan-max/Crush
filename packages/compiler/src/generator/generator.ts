
import { NodeTypes } from '@crush/types'
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
    return nodes.length === 1 ?
        genNode(nodes[0]) :
        genFragment(genChildren(nodes))
}

function genChildren(nodes: any) {
    var children = nodes.map((ast: any) => genNode(ast))
    return toArray(children)
}
function genNode(node: AstNode) {
    switch (node.type) {
        case NodeTypes.FOR:
            debugger
        case NodeTypes.HTML_ELEMENT:
            return callFn(
                Source.createElement,
                toString(node.tagName)
                )
        case NodeTypes.SVG_ELEMENT:
            return callFn(Source.createSVGElement)
        case NodeTypes.COMPONENT:
            return callFn(Source.createComponent)
        case NodeTypes.TEXT:
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

