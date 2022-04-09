
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
    callFn,
    destructur
} from './stringify'


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

function genChildren(nodes: any[]): string[] {

    /*
        process the condition branch and the first dir is condition 
    */

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
import { isArray, isObject, throwError } from '@crush/common'

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
        case Nodes.MEDIA_RULE:
            const rules = toArray(genRules(node.children))
            return callFn(renderMethodsNameMap.createMedia, toString(node.media), rules)
        case Nodes.KEYFRAMES_RULE:
            return callFn(renderMethodsNameMap.createKeyframes, toString(node.keyframes), toArray(genRules(node.children)))
        case Nodes.KEYFRAME_RULE:
            return callFn(renderMethodsNameMap.createKeyframe, toString(node.selector.selectorText), toArray(genRules(node.children)))
        case Nodes.SUPPORT_RULE:
            return callFn(renderMethodsNameMap.createSupport, toString(node.support), toArray(genRules(node.children)))
        case Nodes.DECLARATIONS:
            return callFn(renderMethodsNameMap.createDeclaration, genDeclarations(node.declarations))
        default:
            return ''
    }
}


/*
    if children have one child return fragment
*/
function genRulesOrFragment(rules: any) {
    const children = genRules(rules)
    return children.length === 1 ? children[0] : genFragment(toArray(children))
}

function genRules(rules: any[]) {
    var res: any = []
    var inBranch = false
    // 相比于genchildren ， 不需要处理属性中的指令
    rules.forEach((rule) => {
        switch (rule.type) {
            case Nodes.IF:
                // new branch
                res.push([rule])
                inBranch = true
                break
            case Nodes.ELSE_IF:
                if (inBranch) {
                    res[res.length - 1].push(rule)
                } else {
                    throwError(' not legal else-if ')
                }
                break
            case Nodes.ELSE:
                if (inBranch) {
                    res[res.length - 1].push(rule)
                } else {
                    throwError(' not legal else-if ')
                }
                break
            case Nodes.FOR:
                inBranch = false
                // 循环结构不会使用解构 ， 并且for循环会携带一层fragment
                res.push(genFragment(genFor(genRulesOrFragment(rule.children), rule.iterator)))
                break
            default:
                inBranch = false
                res.push(genNode(rule))
        }
    })

    // array 代表分支内容
    res = res.map((item: any) => {
        if (isArray(item)) {
            const branchCondition = item.map((b) => b.condition)
            const branchContent = item.map((b) => genRulesOrFragment(b.children))
            return ternaryChains(branchCondition, branchContent)
        } else {
            return item
        }
    })
    return res
}

const genFragment = (code: string) => callFn(Source.createFragment, code)

const genTextContent = (texts: Text[]) => {
    return texts.map((text: Text) => {
        return text.isDynamic ? callFn(Source.display, text.content) : toBackQuotes(text.content)
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
                isDynamicProperty,
                isDynamicValue,
                isImportant
            } = declaration.declaration
            const _property = isDynamicProperty ? dynamicMapKey(property) : property
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
