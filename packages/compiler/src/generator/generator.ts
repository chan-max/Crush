
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
    destructur,
    declare
} from './stringify'

import {
    Text
} from '../parser/parseText'

// the code Entrance
export const genNodes = (nodes: any[], context: any): string => {
    const children = genChildren(nodes, context)
    if (children.length === 0) {
        return 'null'
    } else if (children.length === 1) {
        return children[0]
    } else {
        return genFragment(toArray(children))
    }
}


/*
    process if elseIf else branch
*/

function genChildren(nodes: any[], context: any): string[] {
    /*
        process the condition branch and the first dir is condition ,
        处理分支时会为if边际上branch start ， elseif else 标记为branch，或者元素的第一个指令为分支
    */
    var children: any = []
    var inBranch = false
    nodes.forEach((node) => {
        /*
            branchstart mean if frgment and if the element has the first directive is if 
        */
        if (node.isBranchStart) {
            children.push([node])
            inBranch = true
        } else if (node.isBranch) {
            if (inBranch) {
                children[children.length - 1].push(node)
            } else {
                //error
            }
        } else {
            children.push(genNode(node, context))
            inBranch = false
        }
    })

    children = children.map((child: any) => {
        if (isArray(child)) {
            const branchCondition = child.map((b) => b.condition).filter(Boolean) // 勇于筛除else的condition ， 其他应该在之前就报错
            const branchContent = child.map((b) => genNode(b, context))
            return ternaryChains(branchCondition, branchContent)
        } else {
            return child
        }
    })
    return children
}

import {
    Iterator
} from '../parser/parseIterator'
import { joinSelector, mergeSplitedSelector, splitSelector } from '@crush/core/src/renderer/common/mergeSelector'
import { getUid, isArray, isObject, throwError } from '@crush/common'
import { getUstr } from '@crush/common/src/value'

const genFor = (target: string, iterator: Iterator) => callFn(Source.iterator, iterator.iterable, toArrowFunction(target, iterator.items))
const genIf = (target: string, condition: string) => ternaryExp(condition, target, 'null')

function genForWithFragment(target: string, iterator: Iterator) {
    return genFragment(genFor(target, iterator))
}

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
                target = genForWithFragment(target, dir.iterator)
                break
        }
        return genDirectives(target, dirs)
    }
}

function genChildrenString(children: any, context: any) {
    return toArray(genChildren(children, context))
}

function genNode(node: any, context: any): string {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as any[], context)
        case Nodes.FOR:
            debugger
        case Nodes.HTML_ELEMENT:
            const tagName = toString(node.tagName) // required
            var children = node.children ? genChildrenString(node.children, context) : 'null'
            const props = 'null'
            var code = callFn(renderMethodsNameMap.createElement, tagName, props, children)
            if (node.dirs) {
                code = genDirectives(code, node.dirs)
            }
            return code
        case Nodes.SVG_ELEMENT:
            return callFn(Source.createSVGElement)
        case Nodes.COMPONENT:
            var uVar = getUstr()
            context.code.pushNewLine(
                declare(
                    uVar,
                    callFn(renderMethodsNameMap.getComponent, toString(node.tagName), 'instance')
                )
            )
            return callFn(renderMethodsNameMap.createComponent, uVar)
        case Nodes.TEXT:
            return genText(node.children as Text[])
        case Nodes.STYLE:
            var children = toArray(genRules(node.children, context))
            return callFn(renderMethodsNameMap.createSheet, 'null', callFn(renderMethodsNameMap.flatRules, children))
        case Nodes.STYLE_RULE:
            return callFn(Source.createStyle, genSelector(node.selectors), toArray(genRules(node.children, context)))
        case Nodes.MEDIA_RULE:
            const rules = toArray(genRules(node.children, context))
            return callFn(renderMethodsNameMap.createMedia, toString(node.media), rules)
        case Nodes.KEYFRAMES_RULE:
            return callFn(renderMethodsNameMap.createKeyframes, toString(node.keyframes), toArray(genRules(node.children, context)))
        case Nodes.KEYFRAME_RULE:
            return callFn(renderMethodsNameMap.createKeyframe, toString(node.selector.selectorText), toArray(genRules(node.children, context)))
        case Nodes.SUPPORT_RULE:
            return callFn(renderMethodsNameMap.createSupport, toString(node.support), toArray(genRules(node.children, context)))
        case Nodes.DECLARATIONS:
            return callFn(renderMethodsNameMap.createDeclaration, genDeclarations(node.declarations))
        default:
            return ''
    }
}


/*
    if children have one child return fragment
*/
function genRulesOrFragment(rules: any, context: any) {
    const children = genRules(rules, context)
    return children.length === 1 ? children[0] : genFragment(toArray(children))
}

function genRules(rules: any[], context: any) {
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
                res.push(genFragment(genFor(genRulesOrFragment(rule.children, context), rule.iterator)))
                break
            default:
                inBranch = false
                res.push(genNode(rule, context))
        }
    })

    // array 代表分支内容
    res = res.map((item: any) => {
        if (isArray(item)) {
            const branchCondition = item.map((b) => b.condition)
            const branchContent = item.map((b) => genRulesOrFragment(b.children, context))
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
