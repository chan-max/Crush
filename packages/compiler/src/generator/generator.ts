
import { Nodes } from '@crush/types'
import {
    Source,
    renderMethodsNameMap
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
    mergeSelectors
} from '@crush/core'

import {
    scopedExp
} from '../helper/scopedExp'

import {
    Text
} from '../parser/parseText'

// the code Entrance
export const genNodes = (nodes: any[]): string => {
    if (nodes.length === 0) {
        return 'null'
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

var UNKNOWN = Symbol('unknown')

function genChildren(nodes: any[]): string[] {
    const children: string[] = []
    const branchContent: string[] = []
    const branchCondition: string[] = []
    var inBranch = false
    nodes.forEach((node) => {
        const firstDir = node.dirs?.[0]
        const firstDirType = firstDir?.type
        const firstDirContent = firstDir?.condition
        // 8 branch
        if (firstDirType === Nodes.IF) {
            if (inBranch) {
                /*
                    in branch , and end
                */
                children.push(ternaryChains(branchCondition, branchContent))
                inBranch = false
            } else {
                node.dirs?.shift()
                branchContent.push(genNode(node))
                branchCondition.push(firstDirContent)
                debugger // 当只有一个if 分支时， 不会清空内容
                inBranch = true
            }
        } else if (firstDirType === Nodes.ELSE_IF) {
            if (inBranch) {
                node.dirs?.shift()
                branchContent.push(genNode(node))
                branchCondition.push(firstDirContent)
            } else {
                //error
            }
        } else if (firstDirType === Nodes.ELSE) {
            // else not as the end flag of the branch , when the type is not branch or undifined , it will end 
            if (inBranch) {
                node.dirs?.shift()
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

const genFor = (target: string, iterator: Iterator) => callFn(Source.iterator, iterator.iterable, toArrowFunction(target, iterator.items))
const genIf = (target: string, condition: string) => ternaryExp(condition, target, 'null')

const genDirectives = (target: string, dirs: any[]): string => {
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
                target = genIf(target, dir.condition)
                break
            case Nodes.FOR:
                target = genFor(target, dir.iterator)
                break
        }
        return genDirectives(target, dirs)
    }
}

function genNode(node: any): string {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as any[])
        case Nodes.FOR:
        case Nodes.HTML_ELEMENT:
            var el = callFn(
                Source.createElement,
                toString(node.tagName)
            )
            if (node.dirs) {
                el = genDirectives(el, node.dirs)
            }
            return el
        case Nodes.SVG_ELEMENT:
            return callFn(Source.createSVGElement)
        case Nodes.COMPONENT:
            return callFn(Source.createComponent)
        case Nodes.TEXT:
            return genText(node.children as Text[])
        case Nodes.STYLE:
            var children = genChildren(node.children)
            return callFn(Source.createSheet, children as any)
        case Nodes.STYLE_RULE:
            var selector = genSelector(node.selectors)
            var children = genChildren(node.children)
            return callFn(Source.createStyle, selector,toArray(children))
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

function genSelector(selectors: Array<any>) {
    //! one dynamic selector will effect all 

    /*
        s , d , s ,d ,s ,d ,s ,d
    */

    var contents: any = []
    var isDynamic = selectors.every((selector: any) => {
        contents.push(selector.selectorText)
        return !selector.isDynamic
    })
    return isDynamic ?
        callFn(Source.mergeSelectors, contents.map(toBackQuotes)) :
        toString(mergeSelectors(...contents))
}
