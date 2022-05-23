
import { Nodes } from '@crush/core'
import {
    renderMethodsNameMap
} from './source'

import {
    ternaryExp,
    ternaryChains,
    dynamicMapKey,
    toBackQuotes,
    toTernaryExp,
    stringify,
    objectStringify,
    toArrowFunction,
    destructur,
    declare,
    NULL,
    toCodeString
} from './stringify'

import {
    Text
} from '../parser/parseText'

import {
    uStringId
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
        return genFragment(stringify(children), context)
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
import { uid, isArray, isObject, error } from '@crush/common'
import { uVar } from '@crush/common/src/value'
import { createHandlerKey, } from '@crush/core'

const genFor = (target: string, iterator: Iterator, context: any) => context.callRenderFn(
    renderMethodsNameMap.renderList,
    iterator.iterable, toArrowFunction(target, iterator.items),
    uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */
)
const genIf = (target: string, condition: string) => ternaryExp(condition, target, 'null')

function genForWithFragment(target: string, iterator: Iterator, context: any) {
    return genFragment(genFor(target, iterator, context), context)
}

const genDirectives = (target: string, dirs: any[], context: any): string => {
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
                target = genForWithFragment(target, dir.iterator, context)
                break
            case Nodes.SLOT:
                // where there is a slot directive on a element or component , the target will be the backup content
                var slotName = toBackQuotes(dir.value || 'default')
                target = context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, target)
                break
            case Nodes.DEFINE_SLOT:
                debugger
                break
        }
        return genDirectives(target, dirs, context)
    }
}

function genCustomDirectives(code: string, customDirs: any[], context: any): string {
    // injectDirective
    var dirs = customDirs.map((directive: any) => {
        var { property, value, isDynamicProperty, argument, modifiers } = directive
        var content: any = []
        var dir = context.callRenderFn(renderMethodsNameMap.getDirective, isDynamicProperty ? property : toCodeString(property))
        if (!isDynamicProperty) {
            dir = context.hoistExpression(dir)
        }
        // 
        content.push(dir)
        if (value) {
            content.push(value)
        }
        if (argument) {
            content.push(argument.map(toCodeString))
        }
        if (modifiers) {
            content.push(argument.map(toCodeString))
        }
        return content
    })
    return context.callRenderFn(renderMethodsNameMap.injectDirectives, code, stringify(dirs))
}

function genChildrenString(children: any, context: any) {
    if (!children) return NULL
    return stringify(genChildren(children, context))
}

function genDirs(code: string, node: any, context: any) {
    if (node.customDirs) { code = genCustomDirectives(code, node.customDirs, context) }
    if (node.dirs) { code = genDirectives(code, node.dirs, context) }
    return code
}

function genNode(node: any, context: any): any {
    switch (node.type) {
        case Nodes.IF:
        case Nodes.ELSE_IF:
        case Nodes.ELSE:
            return genNodes(node.children as any[], context)
        case Nodes.FOR:
            // use the fragment , cause the iterator will set the u key in each node , 
            return genForWithFragment(genNodes(node.children, context), node.iterator, context)
        case Nodes.TEMPLATE:
            var code = genNodes(node.children as any[], context)
            if (node.dirs) { code = genDirectives(code, node.dirs, context) }
            return code
        case Nodes.SLOT:
            var slotName = toBackQuotes(node.attributeMap?.name || 'default')
            var backup = genNodes(node.children, context)
            return context.callRenderFn(renderMethodsNameMap.renderSlot, slotName, backup)
        case Nodes.DEFINE_SLOT:
            debugger
            break
        case Nodes.HTML_ELEMENT:
            var code: string = context.callRenderFn(renderMethodsNameMap.createElement, toBackQuotes(node.tagName), genProps(node, context), genChildrenString(node.children, context), uStringId())
            code = genDirs(code, node, context)
            return code
        case Nodes.SVG_ELEMENT:
            debugger
            return context.callRenderFn(renderMethodsNameMap.createSVGElement)
        case Nodes.COMPONENT:
            var code: string = context.callRenderFn(renderMethodsNameMap.getComponent, toBackQuotes(node.tagName))
            var uv = context.hoistExpression(code)
            var props = genProps(node, context)
            // var slots = genChildren(node.children, context)
            // debugger
            code = context.callRenderFn(renderMethodsNameMap.createComponent, uv, props, NULL, uStringId())
            code = genDirs(code, node, context)
            return code
        case Nodes.TEXT:
            return genText(node.children as Text[], context)
        case Nodes.STYLE:
            var code: string = context.callRenderFn(renderMethodsNameMap.createStyleSheet, 'null', stringify(genChildren(node.children, context)), uStringId())
            if (node.dirs) { code = genDirectives(code, node.dirs, context) }
            if (node.customDirs) { code = genCustomDirectives(code, node.customDirs, context) }
            return code
        case Nodes.STYLE_RULE:
            return context.callRenderFn(renderMethodsNameMap.createStyle, genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId())
        case Nodes.MEDIA_RULE:
            const rules = stringify(genChildren(node.children, context))
            return context.callRenderFn(renderMethodsNameMap.createMedia, toBackQuotes(node.media), rules, uStringId())
        case Nodes.KEYFRAMES_RULE:
            return context.callRenderFn(renderMethodsNameMap.createKeyframes, toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId())
        case Nodes.KEYFRAME_RULE:
            return context.callRenderFn(renderMethodsNameMap.createKeyframe, toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId())
        case Nodes.SUPPORTS_RULE:
            return context.callRenderFn(renderMethodsNameMap.createSupports, toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId())
        case Nodes.DECLARATION_GROUP:
            return context.callRenderFn(renderMethodsNameMap.createDeclaration, genDeclartion(node.children, context), uStringId())
    }
}

const genFragment = (code: string, context: any) => context.callRenderFn(renderMethodsNameMap.createFragment, code, uStringId())

const genTextContent = (texts: Text[], context: any) => {
    return texts.map((text: Text) => {
        return text.isDynamic ? context.callRenderFn(renderMethodsNameMap.display, text.content) : toBackQuotes(text.content)
    }).join('+')
}

const genText = (texts: Text[], context: any) => {
    return context.callRenderFn(
        renderMethodsNameMap.createText,
        genTextContent(texts, context),
        uStringId()
    )
}


/*
    while there is unknown selectors
    header,footer ? h1,h2
*/

function genSelector(selectors: Array<any>, context: any) {
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
            return toBackQuotes(joinSelector(item))
        } else { // dynamic
            // scope  
            return toBackQuotes(item)
        }
    })

    return selectorCode.length === 1 ?
        selectorCode[0] :
        context.callRenderFn(renderMethodsNameMap.mergeSelectors, ...selectorCode)

    //! one dynamic selector will effect all 
}

// declaration and mixin
function genDeclartion(declarationGroup: any[], context: any) {
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
            const _value = isDynamicValue ? value : toBackQuotes(value)
            const __value = isImportant ? context.callRenderFn(renderMethodsNameMap.important, _value) : _value
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
        return context.callRenderFn(renderMethodsNameMap.mixin, ..._res)
    }
}


function genProps(node: any, context: any) {
    var {
        type, attributes
    } = node
    if (!(attributes && attributes.length)) {
        // attributes may be an empty array , becasue the directives
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
                    isHandler, /* if true , just use it , or wrap an arrow function */
                    argument,
                    modifiers
                } = attr

                var handlerKey = isDynamicProperty ?
                    dynamicMapKey(context.callRenderFn(renderMethodsNameMap.createHandlerKey, property, stringify(argument.map(toBackQuotes)))) :
                    createHandlerKey(property, argument)

                var callback = isHandler ? value : toArrowFunction(value)
                if (modifiers) {
                    callback = context.callRenderFn(renderMethodsNameMap.createEvent, callback, stringify(modifiers.map(toBackQuotes)))
                }
                props[handlerKey] = callback
                break
            case Nodes.CLASS:
                var _class = props.class ||= []
                _class.push(attr.value)
                break
            case Nodes.STYLE:
                var style = props.style ||= []
                style.push(attr.value)
                break
            case Nodes.HTML_ATTRIBUTE:
                // normal attributes
                var {
                    property,
                    value,
                    isDynamicProperty,
                    isDynamicValue,
                } = attr
                props[isDynamicProperty ? dynamicMapKey(property) : property] = isDynamicValue ? value : toBackQuotes(value)
                break
        }
    });

    // merge class , there could be more than one class
    if (props.class) {
        props.class = context.callRenderFn(renderMethodsNameMap.normalizeClass, stringify(props.class))
    }

    if (props.style) {
        props.style = context.callRenderFn(renderMethodsNameMap.normalizeStyle, stringify(props.style))
    }

    return stringify(props)
}