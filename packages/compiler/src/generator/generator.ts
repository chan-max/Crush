
import { Nodes } from '@crush/types'
import {
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
    declare,
    NULL
} from './stringify'

import {
    Text
} from '../parser/parseText'

import {
    ustringid
} from '@crush/common'

// the code Entrance
export const genNodes = (nodes: any[], context: any): string => {
    if (!nodes) {
        return NULL
    }
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

    if (!nodes) {
        return []
    }

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
import { uid, isArray, isObject, throwError } from '@crush/common'
import { uvar } from '@crush/common/src/value'
import { toHandlerKey } from '@crush/core'

const genFor = (target: string, iterator: Iterator) => callFn(
    renderMethodsNameMap.renderList,
    iterator.iterable, toArrowFunction(target, iterator.items),
    ustringid() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */
)
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
        // from end to start
        var dir = dirs[dirs.length - 1]
        dirs.pop()
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

function genNode(node: any, context: any): any {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as any[], context)
        case Nodes.FOR:
            // use for tag not directive
            return genForWithFragment(genNodes(node.children, context), node.iterator)
        case Nodes.TEMPLATE:
            var code = genNodes(node.children as any[], context)
            if (node.dirs) { code = genDirectives(code, node.dirs) }
            return code
        case Nodes.HTML_ELEMENT:
            const tagName = toString(node.tagName) // required
            var children = node.children ? genChildrenString(node.children, context) : 'null'
            const props = genProps(node)
            var code = callFn(renderMethodsNameMap.createElement, tagName, props, children, ustringid())
            if (node.dirs) {
                code = genDirectives(code, node.dirs)
            }
            return code
        case Nodes.SVG_ELEMENT:
            return callFn(renderMethodsNameMap.createSVGElement)
        case Nodes.COMPONENT:
            var uVar = uvar()
            context.pushNewLine(
                declare(
                    uVar,
                    callFn(renderMethodsNameMap.getComponent, toString(node.tagName))
                )
            )
            return callFn(renderMethodsNameMap.createComponent, uVar)
        case Nodes.TEXT:
            return genText(node.children as Text[])
        case Nodes.STYLE:
            return callFn(renderMethodsNameMap.createStyleSheet, 'null', toArray(genChildren(node.children, context)), ustringid())
        case Nodes.STYLE_RULE:
            return callFn(renderMethodsNameMap.createStyle, genSelector(node.selectors), toArray(genChildren(node.children, context)))
        case Nodes.MEDIA_RULE:
            const rules = toArray(genChildren(node.children, context))
            return callFn(renderMethodsNameMap.createMedia, toString(node.media), rules)
        case Nodes.KEYFRAMES_RULE:
            return callFn(renderMethodsNameMap.createKeyframes, toString(node.keyframes), toArray(genChildren(node.children, context)))
        case Nodes.KEYFRAME_RULE:
            return callFn(renderMethodsNameMap.createKeyframe, toString(node.selector.selectorText), toArray(genChildren(node.children, context)))
        case Nodes.SUPPORT_RULE:
            return callFn(renderMethodsNameMap.createSupport, toString(node.support), toArray(genChildren(node.children, context)))
        case Nodes.DECLARATION_GROUP:
            return callFn(renderMethodsNameMap.createDeclaration, genDeclartion(node.children))
        default:
            return ''
    }
}

const genFragment = (code: string) => callFn(renderMethodsNameMap.createFragment, code, ustringid())

const genTextContent = (texts: Text[]) => {
    return texts.map((text: Text) => {
        return text.isDynamic ? callFn(renderMethodsNameMap.display, text.content) : toBackQuotes(text.content)
    }).join('+')
}

const genText = (texts: Text[]) => {
    return callFn(
        renderMethodsNameMap.createText,
        genTextContent(texts),
        ustringid()
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
function genDeclartion(declarationGroup: any[]) {
    var res: any = []
    var lastIsDeclaration = false
    declarationGroup.forEach((declaration) => {
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


function genProps(node: any) {
    var {
        type, attributes
    } = node
    if (!(attributes && attributes.length)) {
        /*
            此时为无属性或均为指令
        */
        return NULL
    }
    var props: any = {}
    attributes.forEach((attr: any) => {
        switch (attr.type) {
            case Nodes.EVENT:
                var {
                    property,
                    isDynamicProperty,
                    value,
                    isCalled,
                    argument,
                    modifiers
                } = attr
                var handlerKey = isDynamicProperty ? dynamicMapKey(callFn(renderMethodsNameMap.toHandlerKey, property)) : toHandlerKey(property)
                var callback = value
                if (modifiers) {
                    callback = callFn(renderMethodsNameMap.createEvent, callback, toArray(modifiers.map(toString)))
                }
                props[handlerKey] = callback
                break
            /*
                support mutiple class in one element 
                <h1
                    class="top"
                    class="warn"
                    $class="myCustomClass1"
                    $class="myCustomClass2"
                >
            */
            case Nodes.CLASS:
                var {
                    isDynamicValue,
                    value
                } = attr
                var classList = props.class ||= []
                classList.push(isDynamicValue ? value : toString(value))
                break
            case Nodes.HTML_ATTRIBUTE:
                // normal attributes
                var {
                    property,
                    value,
                    isDynamicProperty,
                    isDynamicValue,
                } = attr
                props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toString(value)
                break
        }
    });

    // merge class , there could be more than one class
    if (props.class) {
        props.class = callFn(renderMethodsNameMap.normalizeClass, toArray(props.class))
    }

    return objectStringify(props)
} 