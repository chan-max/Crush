
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


// the code Entrance
export const genNodes = (nodes: AstNode[]): string => {
    if (nodes.length === 0) {
        return Source.null
    } else if (nodes.length === 1) {
        return genNode(nodes[0])
    } else {
        var children = genChildren(nodes)
        if (children.length <= 1) {
            return children[0]
        } else {
            return genFragment(toArray(children))
        }
    }
}

/*
    process if elseIf else branch
*/
function genChildren(nodes: AstNode[]): string[] {
    const children: string[] = []
    const branchContent: string[] = []
    const branchCondition: string[] = []
    var inBranch = false
    nodes.forEach((node) => {
        const firstDir = node.compileDir?.[0]
        const firstDirType = firstDir?.type
        const firstDirContent = firstDir?.content
        // 8 branch
        if (firstDirType === Nodes.IF) {
            if (inBranch) {
                children.push(ternaryChains(branchCondition, branchContent))
                inBranch = false
            } else {
                node.compileDir?.shift()
                branchContent.push(genNode(node))
                branchCondition.push(firstDirContent)
                inBranch = true
            }
        } else if (firstDirType === Nodes.ELSE_IF) {
            if (inBranch) {
                node.compileDir?.shift()
                branchContent.push(genNode(node))
                branchCondition.push(firstDirContent)
            } else {
                //error
            }
        } else if (firstDirType === Nodes.ELSE) {
            // else not as the end flag of the branch , when the type is not branch or undifined , it will end 
            if (inBranch) {
                node.compileDir?.shift()
                branchContent.push(genNode(node))
                children.push(ternaryChains(branchCondition, branchContent))
            } else {
                //error
            }
        } else {
            if (inBranch) {
                children.push(ternaryChains(branchCondition, branchContent))
                inBranch = false
            } else {
                children.push(genNode(node))
            }
        }
    })
    return children
}

import {
    Iterator
} from '../parser/parseIterator'

const genFor = (target: string, iterator: Iterator) => callFn(Source.iterator, toArrowFunction(target, iterator.items))
const genIf = (target: string, condition: string) => ternaryExp(condition, target, Source.null)

import {
    Dir
} from '../parser/parseNode'
const genDirectives = (target: string, dirs: Dir[]): string => {
    /*
        there is no possible to exist else-if or else
    */
    if (dirs.length === 0) {
        return target
    } else {
        var dir = dirs[0]
        dirs.shift()
        switch (dir.type) {
            case Nodes.IF:
                target = genIf(target, dir.content)
                break
            case Nodes.FOR:
                target = genFor(target, dir.content)
                break
        }
        return genDirectives(target, dirs)
    }
}

function genNode(node: AstNode): string {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as AstNode[])
        case Nodes.FOR:
        case Nodes.HTML_ELEMENT:
            var el = callFn(
                Source.createElement,
                toString(node.tagName)
            )
            if (node.compileDir) {
                el = genDirectives(el, node.compileDir)
            }
            return el
        case Nodes.SVG_ELEMENT:
            return callFn(Source.createSVGElement)
        case Nodes.COMPONENT:
            return callFn(Source.createComponent)
        case Nodes.TEXT:
            return genText(node.children as Text[])
        case Nodes.STYLE:
            return callFn(Source.createSheet)            
        default:
            return ''
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

