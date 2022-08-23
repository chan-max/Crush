import { AstTypes } from '../parser/parseTemplate'

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
    toSingleQuotes,
    toReservedProp
} from '../stringify'


import {
    camelize,
    emptyArray,
    emptyObject,
    hasOwn,
    isEmptyObject,
    uid,
    uStringId
} from '@crush/common'
import { isArray, isObject } from '@crush/common'


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
    // 所有节点都会再此处理
    /*
        process the condition branch and the first dir is condition ,
        处理分支时会为if边际上branch start ， elseif else 标记为branch，或者元素的第一个指令为分支
    */
    var children: any = []
    var inBranch = false

    nodes.forEach((node) => {
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
            let nodeCode = genNode(node, context)
            children.push(nodeCode)
            inBranch = false
        }
    })

    children = children.map((child: any) => {
        if (isArray(child)) {
            const branchCondition = child.map((b) => b.condition).filter(Boolean) // 勇于筛除else的condition ， 其他应该在之前就报错
            const branchContent = child.map((b) => {
                let nodeCode = genNode(b, context)
                return nodeCode
            })
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

const genFor = (target: string, iterator: Iterator, context: any) => {
    return context.callRenderFn(
        'renderList',
        iterator.iterable, toArrowFunction(target, ...iterator.items),
        uStringId() /* 显示的在迭代器中传入掺入一个key，每次渲染时这个key不变，并且子节点会根据索引生成唯一key,只需要子层级即可 */
    )
}


function genForWithFragment(target: string, iterator: Iterator, context: any) {
    return genFragment(genFor(target, iterator, context), context)
}



function genChildrenString(children: any, context: any) {
    if (!children) return NULL
    return stringify(genChildren(children, context))
}

function genDirs(code: string, node: any, context: any) {
    if (node.customDirectives) { code = genCustomDirectives(code, node.customDirectives, context) }
    return code
}

function genCustomDirectives(code: any, directives: any, context: any) {
    var dirs = directives.map((directive: any) => {
        var { property, value, isDynamicProperty, _arguments, modifiers, filters } = directive
        var directive = context.useDirective(property, isDynamicProperty)
        let bindings: any = {
            directive
        }
        if (value) {
            bindings.value = value
        }
        if (_arguments) {
            bindings._arguments = _arguments && _arguments.map(toSingleQuotes)
        }
        if (modifiers) {
            bindings.modifiers = modifiers && modifiers.map(toSingleQuotes)
        }
        if (filters) {
            bindings.filters = filters && filters.map(toSingleQuotes)
        }
        return bindings
    });
    return context.callRenderFn('injectDirectives', code, stringify(dirs))
}

function genSlotContent(node: any, context: any) {
    var { children } = node
    /*
        关于插槽的定义 , 
        插槽指令只能 存在子节点的最外一层，并在处理指令时 提升到最外层节点上
        如 <template slot="header" slot-scope="x"> ,
        暂时插槽数量还是固定的，无法通过循环定义多个具名插槽
    */
    if (!children) return NULL
    var _default: any
    var slots: Record<string, string> = {}

    children.forEach((child: any) => {
        var { defineSlotName, slotScope } = child
        // 作用域插槽只能在具名插槽上
        if (defineSlotName) {
            slots[defineSlotName] = toArrowFunction(genNode(child, context), slotScope)
        } else {
            (_default ||= []).push(child)
        }
    });

    if (_default) {
        // ! 默认插槽不存在作用域插槽
        slots.default = toArrowFunction(genNodes(_default, context))
    }
    return stringify(slots)
}

function genNode(node: any, context: any): any {
    let nodeCode: any = null
    switch (node.type) {
        case AstTypes.HTML_COMMENT:
            nodeCode = context.callRenderFn('createComment', toBackQuotes(node.children), uid())
            break
        case AstTypes.CONDITION_RENDER_IF:
        case AstTypes.CONDITION_RENDER_ELSE_IF:
        case AstTypes.CONDITION_RENDER_ELSE:
            nodeCode = genNodes(node.children as any[], context)
            break
        case AstTypes.LIST_RENDER:
            // use the fragment , cause the iterator will set the u key in each node , 
            nodeCode = genForWithFragment(genNodes(node.children, context), node.iterator, context)
            break
        case AstTypes.FRAGMENT:
            nodeCode = genNodes(node.children as any[], context)
            break
        case AstTypes.USE_COMPONENT_SLOT:
            const { slotName, isDynamicSlot, children } = node
            var { propsCode } = genProps(node, context)
            nodeCode = context.callRenderFn('renderSlot', isDynamicSlot ? slotName : toBackQuotes(slotName), propsCode, children ? toArrowFunction(genNodes(children, context)) : NULL, uid())
            break
        case AstTypes.DEFINE_COMPONENT_SLOT:
            nodeCode = genNodes(node.children as any[], context)
            break
        case AstTypes.DYNAMIC_HTML_ELEMENT:
            var { is, isDynamicIs } = node
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var code: string = context.callRenderFn('createElement', isDynamicIs ? is : toSingleQuotes(is), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.DYNAMIC_SVG_ELEMENT:
            var { is, isDynamicIs } = node
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var code: string = context.callRenderFn('createSVGElement', isDynamicIs ? is : toSingleQuotes(is), propsCode, uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.HTML_ELEMENT:
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var code: string = context.callRenderFn('createElement', toBackQuotes(node.tagName), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.SVG_ELEMENT:
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var code: string = context.callRenderFn('createSVGElement', toBackQuotes(node.tagName), propsCode, genChildrenString(node.children, context), uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.DYNAMIC_COMPONENT:
            var { is, isDynamicIs } = node
            var component = context.useComponent(is, isDynamicIs)
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var slots = genSlotContent(node, context)
            code = context.callRenderFn('createComponent', component, propsCode, slots, uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.COMPONENT:
            var component = context.useComponent(node.tagName, false)
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var slots = genSlotContent(node, context)
            code = context.callRenderFn('createComponent', component, propsCode, slots, uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.TEXT:
            nodeCode = genText(node.children as Text[], context)
            break
        case AstTypes.STYLESHEET:
            var { propsCode, dynamicPropsCode } = genProps(node, context)
            var code: string = context.callRenderFn('createStyleSheet', propsCode, stringify(genChildren(node.children, context)), hasOwn(node, 'scoped'), uStringId(), dynamicPropsCode)
            code = genDirs(code, node, context)
            nodeCode = code
            break
        case AstTypes.STYLE_RULE:
            nodeCode = context.callRenderFn('createStyle', genSelector(node.selectors, context), stringify(genChildren(node.children, context)), uStringId())
            break
        case AstTypes.MEDIA_RULE:
            const rules = stringify(genChildren(node.children, context))
            nodeCode = context.callRenderFn('createMedia', node.appConfigMedia ? context.callRenderFn('getCustomScreensMedia', toBackQuotes(node.media)) : toBackQuotes(node.media), rules, uStringId())
            break
        case AstTypes.KEYFRAMES_RULE:
            nodeCode = context.callRenderFn('createKeyframes', toBackQuotes(node.keyframes), stringify(genChildren(node.children, context)), uStringId())
            break
        case AstTypes.KEYFRAME_RULE:
            nodeCode = context.callRenderFn('createKeyframe', toBackQuotes(node.selector.selectorText), stringify(genChildren(node.children, context)), uStringId())
            break
        case AstTypes.SUPPORTS_RULE:
            nodeCode = context.callRenderFn('createSupports', toBackQuotes(node.supports), stringify(genChildren(node.children, context)), uStringId())
            break
        case AstTypes.DECLARATION_GROUP:
            nodeCode = context.callRenderFn('createDeclaration', genDeclartion(node.children, context), uStringId())
            break
    }

    if (node.directives) {
        node.directives.reverse().forEach((dir: any) => {
            if (dir.type == AstTypes.LIST_RENDER) {
                nodeCode = genForWithFragment(nodeCode, dir.iterator, context)
            } else if (dir.type === AstTypes.CONDITION_RENDER_IF) {
                nodeCode = ternaryExp(dir.condition, nodeCode, NULL)
            }
        })
    }
    return nodeCode
}

const genFragment = (code: string, context: any) => context.callRenderFn('createFragment', code, uStringId())

const genTextContent = (texts: any, context: any) => {
    return
}

const genText = (texts: Text[], context: any) => {
    let isDynamicText = false
    let textContent = texts.map((text: any) => {
        const { content, isDynamic, modifier } = text
        if (isDynamic) {
            isDynamicText = true
            let args = [content]
            if (modifier) {
                args.push(toSingleQuotes(modifier))
            }
            return context.callRenderFn('display', ...args)
        } else {
            return toBackQuotes(content)
        }
    }).join('+')

    let text = context.callRenderFn('createText', textContent, uid(), isDynamicText)

    if (isDynamicText) {
        return text
    } else {
        return context.hoistExpression(text)
    }
}


/*
    while there is unknown selectors
    header,footer ? h1,h2
*/
import {
    splitSelector,
    mergeSplitedSelector,
    joinSelector,
    toEventName,
    processVnodePrerender
} from '@crush/renderer'

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
            return item
        }
    })

    return selectorCode.length === 1 ?
        selectorCode[0] :
        context.callRenderFn('mergeSelectors', ...selectorCode)

    //! one dynamic selector will effect all 
}

// declaration and mixin
function genDeclartion(declarationGroup: any[], context: any) {
    var res: any = []
    var lastIsDeclaration = false
    declarationGroup.forEach((declaration) => {
        if (declaration.type === AstTypes.MIXIN) {
            res.push(declaration.mixin)
            lastIsDeclaration = false
        } else if (declaration.type === AstTypes.DECLARATION) {
            var target
            if (lastIsDeclaration) {
                target = res[res.length - 1]
            } else {
                target = {}
                res.push(target)
                lastIsDeclaration = true
            }
            var {
                property,
                value,
                isDynamicProperty,
                isDynamicValue,
                isImportant,
                illegalKey
            } = declaration.declaration

            if (isDynamicProperty) {
                // 动态的key不存在不合法情况
                property = dynamicMapKey(property)
            } else if (illegalKey) {
                property = dynamicMapKey(toSingleQuotes(property))
            } else {
                property = camelize(property)
            }


            if (!isDynamicValue) {
                value = toBackQuotes(value)
            }

            if (isImportant) {
                value = context.callRenderFn('important', value)
            }

            target[property] = value
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
        return context.callRenderFn('mixin', ..._res)
    }
}

import {
    toNativeEventName
} from '@crush/renderer'


function genProps(node: any, context: any): any {
    let { type, attributes }:any = node
    attributes ||= emptyArray
    const isComponent = type === AstTypes.COMPONENT

    var props: any = {}
    var dynamicProps: any = []
    attributes.forEach((attr: any) => {
        switch (attr.type) {
            case AstTypes.EVENT:
                var { property, isDynamicProperty, value, isHandler, /* if true , just use it , or wrap an arrow function */    _arguments, filters, modifiers } = attr
                var callback = isHandler ? value : toArrowFunction(value || '$' /* 为空字符时默认的handler*/, '$') // 包裹函数都需要传入一个 $ 参数
                if (modifiers && !isComponent) {
                    callback = context.callRenderFn('withEventModifiers', callback, stringify(modifiers.map(toBackQuotes)))
                }
                if (isDynamicProperty) {
                    let key = isComponent ?
                        context.callRenderFn('toEventName', property, stringify(_arguments && _arguments.map(toBackQuotes)), stringify(modifiers && modifiers.map(toBackQuotes)), stringify(filters && filters.map(toBackQuotes))) :
                        context.callRenderFn('toNativeEventName', property, stringify(_arguments && _arguments.map(toBackQuotes)))
                    props[dynamicMapKey(key)] = callback
                    dynamicProps.push(key)
                } else {
                    let key = (isComponent ? toEventName(property, _arguments, modifiers, filters) : toNativeEventName(property, _arguments))
                    props[key] = callback
                    dynamicProps.push(toSingleQuotes(key))
                }
                break
            case AstTypes.ATTRIBUTE_CLASS:
                var _class = props.class ||= []
                if (attr.isDynamicValue) {
                    _class.push(attr.value)
                    dynamicProps.push(`'class'`)
                } else {
                    _class.push(toBackQuotes(attr.value))
                }
                break
            case AstTypes.ATTRIBUTE_STYLE:
                var style = props.style ||= []
                if (attr.isDynamicValue) {
                    style.push(attr.value)
                    dynamicProps.push(`'style'`)
                } else {
                    style.push(toBackQuotes(attr.value))
                }
                break
            case AstTypes.ATTRIBUTE:
                // normal attributes
                var {
                    property,
                    value,
                    isDynamicProperty,
                    isDynamicValue,
                } = attr

                let key = isDynamicProperty ? dynamicMapKey(property) : property
                props[key] = isDynamicValue ? value : toBackQuotes(value)

                if (isDynamicProperty || isDynamicValue) {
                    dynamicProps.push(toSingleQuotes(property))
                }
                break
        }
    });

    // merge class , there could be more than one class , 不应该在render函数中使用normalize
    if (props.class) {
        props.class = stringify(props.class.length === 1 ? props.class[0] : props.class)
    }

    if (props.style) {
        props.style = stringify(props.style.length === 1 ? props.style[0] : props.style)
    }

    let propsCode, dynamicPropsCode, allPropsStatic = false

    if (dynamicProps.length) {
        // 存在 dynamicProps
        dynamicPropsCode = stringify(dynamicProps)
        propsCode = stringify(props)
    } else {
        dynamicPropsCode = NULL
        if (isEmptyObject(props)) {
            propsCode = NULL
        } else {
            // 提升
            allPropsStatic = true
            propsCode = context.hoistExpression(stringify(props))
        }
    }

    return {
        allPropsStatic,
        propsCode,
        dynamicPropsCode
    }
}

