
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
        return toArray(children)
        // if (children.length <= 1) {
        //     return children[0]
        // } else {
        //     return genFragment(toArray(children))
        // }
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
import { joinSelector, mergeSplitedSelector, splitSelector } from '@crush/core/src/renderer/common/mergeSelector'
import { isArray, isObject } from '@crush/common'

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
            var children = toArray(genRules(node.children))
            return callFn(renderMethodsNameMap.createSheet, 'null', callFn(renderMethodsNameMap.flatRules, children))
        case Nodes.STYLE_RULE:
            return callFn(Source.createStyle, genSelector(node.selectors), toArray(genRules(node.children)))
        case Nodes.DECLARATIONS:
            return callFn(renderMethodsNameMap.createDeclaration, genDeclarations(node.declarations))
        default:
            return ''
    }
}

function genRules(children: any[]) {
    /*
        if elseif else for need destructur
    */
    const res: any = []
    const inBranch = false
    children.forEach((rule: any) => {
        if (rule.type === Nodes.IF) {
            
        } else if (rule.type === Nodes.ELSE_IF) {

        } else if (rule.type === Nodes.ELSE) {

        } else if (rule.type === Nodes.FOR) {
            debugger
        } else {
            res.push(genNode(rule))
        }
    })
    return res
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


/*
    while there is unknown selectors
    header,footer ? h1,h2
*/


function genSelector(selectors: Array<any>) {
    /*
        先保留数组形式,再进行处理
    */
    var res: any = []
    var lastIsStatic = false
    selectors.forEach(({ selectorText, isDynamic }: any) => {
        if (isDynamic) {
            res.push(selectorText)
            lastIsStatic = false
        } else {
            var splitedSelector = splitSelector(selectorText)
            if (lastIsStatic) {
                res[res.length - 1] = mergeSplitedSelector(res[res.length - 1], splitedSelector)
            } else {
                res.push(splitedSelector)
            }
            lastIsStatic = true
        }
    })

    var selectorCode = res.map((item: any) => {
        if (isArray(item)) { // static
            return toString(joinSelector(item))
        } else { // dynamic
            // scope  
            return toBackQuotes(item)
        }
    })

    return selectorCode.length === 1 ?
        selectorCode[0] :
        callFn(renderMethodsNameMap.mergeSelectors, ...selectorCode)

    //! one dynamic selector will effect all 
}

// declaration and mixin
function genDeclarations(declarations: any[]) {
    var res: any = []
    var lastIsDeclaration = false
    declarations.forEach((declaration) => {
        if (declaration.type === Nodes.MIXIN) {
            res.push(declaration.mixin)
            lastIsDeclaration = false
        } else if (declaration.type === Nodes.DECLARATION) {
            var target
            if (lastIsDeclaration) {
                target = res[res.length - 1]
            } else {
                target = {}
                res.push(target)
                lastIsDeclaration = true
            }
            const {
                property,
                value,
                isDynamicPropery,
                isDynamicValue,
                isImportant
            } = declaration.declaration
            const _property = isDynamicPropery ? dynamicMapKey(property) : property
            const _value = isDynamicValue ? value : toString(value)
            const __value = isImportant ? callFn(renderMethodsNameMap.important, _value) : _value
            target[_property] = __value
        }
    })

    const _res = res.map((item: any) => {
        if (isObject(item)) {
            return objectStringify(item)
        } else {
            return item
        }
    })

    if (_res.length === 1) {
        return _res[0]
    } else {
        return callFn(renderMethodsNameMap.mixin, ..._res)
    }
}
