import { camelize, error, hasOwn, hyphenate, initialUpperCase, isArray, uid } from "@crush/common";
import { CodeGenerator } from "../generator/compiler";
import { toArrowFunction, toBackQuotes } from "../stringify";
import { extractFunctionArgs } from "../withScope";
import { parseAttribute } from "./parseAttribute";
import { parseCSS } from "./parseCSS";
import { parseIterator } from "./parseIterator";
import { parseText } from "./parseText";
import { processRules } from "./processRules";


import { isHandler } from "../stringify";

export const enum AstTypes {
    UNKNOWN,
    HTML_ELEMENT,
    HTML_COMMENT,
    SVG_ELEMENT,
    COMPONENT,
    TEXT,
    STYLESHEET,

    CONDITION_RENDER_IF,
    CONDITION_RENDER_ELSE_IF,
    CONDITION_RENDER_ELSE,
    LIST_RENDER,

    FRAGMENT,

    SKIP,

    USE_COMPONENT_SLOT,
    DEFINE_COMPONENT_SLOT,

    ATTRIBUTE,
    EVENT,
    ATTRIBUTE_CLASS,
    ATTRIBUTE_STYLE,
    CUSTOM_DIRECTIVE,

    DYNAMIC_HTML_ELEMENT,
    DYNAMIC_SVG_ELEMENT,
    DYNAMIC_COMPONENT,

    // css
    MEDIA_RULE,
    STYLE_RULE,
    KEYFRAMES_RULE,
    KEYFRAME_RULE,
    SUPPORTS_RULE,
    DECLARATION,
    DECLARATION_GROUP,
    MIXIN
}


export function processTemplateAst(htmlAst: any, context: CodeGenerator): any {
    if (isArray(htmlAst)) {
        return htmlAst.forEach((ast: any) => processTemplateAst(ast, context))
    }

    let scopeStack = 0

    const tagName = htmlAst.tagName = camelize(htmlAst.tag)

    htmlAst.type = context.compilerOptions.isHTMLTag(tagName) ?
        AstTypes.HTML_ELEMENT : context.compilerOptions.isSVGTag(tagName) ?
            AstTypes.SVG_ELEMENT : tagName === 'style' ?
                AstTypes.STYLESHEET : AstTypes.COMPONENT

    let attributes = htmlAst.attributes

    if (attributes) {
        for (let i = 0; i < attributes.length; i++) {
            let attr = attributes[i]
            if (attr.type) {
                continue
            }
            parseAttribute(attr)
            let { attribute, value } = attr
            switch (attr.flag) {
                case 's-':
                case 'cr-':
                case '*':
                    switch (attr.property) {
                        case 'if':
                            if (htmlAst.directives) {
                                htmlAst.directives.push({
                                    type: AstTypes.CONDITION_RENDER_IF,
                                    condition: context.setRenderScope(value)
                                })
                            } else {
                                htmlAst.isBranchStart = true
                                htmlAst.condition = context.setRenderScope(value)
                            }
                            break
                        case 'else-if':
                            htmlAst.isBranch = true
                            htmlAst.condition = context.setRenderScope(value)
                            if (htmlAst.directives) {
                                error('else-if指令必须第一个出现')
                            }
                            break
                        case 'else':
                            htmlAst.isBranch = true
                            if (htmlAst.iterator) {
                                error('else指令必须第一个出现')
                            }
                            break
                        case 'for':
                            // for 指令会最最先进行处理 ， 因为要进行变量提升
                            let iterator = parseIterator(attr.value)
                            iterator.iterable = context.setRenderScope(iterator.iterable)
                            context.pushScope(iterator.items)
                            scopeStack++
                            let directives = htmlAst.directives ||= []
                            directives.push({
                                type: AstTypes.LIST_RENDER,
                                iterator
                            })
                            break
                        case 'text':
                            attr.type = AstTypes.ATTRIBUTE
                            attr.property = 'innerText'
                            attr.isDynamicValue = true
                            attr.value = context.setRenderScope(attr.value)
                            htmlAst.children = null // 直接忽略
                            break
                        case 'html':
                            attr.type = AstTypes.ATTRIBUTE
                            attr.property = 'innerText'
                            attr.isDynamicValue = true
                            attr.value = context.setRenderScope(attr.value)
                            htmlAst.children = null // 直接忽略
                            break
                        case 'bind':
                            attr.type = AstTypes.ATTRIBUTE
                            if (attr._arguments) {
                                // 单属性的bind, 等同于 $
                                attr.property = attr._arguments[0]
                                attr._arguments.shift()
                            }
                            attr.value = context.setRenderScope(attr.value)
                            attr.isDynamicValue = true
                            break
                        case 'ref':
                            // 转为普通的 ref属性
                            attr.type = AstTypes.ATTRIBUTE
                            attr.isDynamicValue = attr?.modifiers?.includes('dynamic')
                            break
                        case 'on':
                            attr.type = AstTypes.EVENT
                            attr.property = attr._arguments[0]
                            attr._arguments.shift()
                            attr.isDynamicValue = true
                            attr.isHandler = isHandler(attr.value)
                            attr.value = context.setRenderScope(attr.value)
                            break
                        case 'native':
                            if (htmlAst.tagName == 'style') {
                                attr.type = AstTypes.ATTRIBUTE
                                attr.property = 'innerHTML'
                                attr.value = htmlAst.children[0].children
                                htmlAst.native = true // 标记该节点
                                break
                            }
                        case 'scoped':
                            if (htmlAst.tagName == 'style') {
                                htmlAst.scoped = true
                                context.useScopedStyleSheet = true
                                break
                            }
                        case 'slot-scope':
                            htmlAst.slotScope = attr.value
                            let args = extractFunctionArgs(attr.value)
                            if (args.length) {
                                context.pushScope(args)
                                scopeStack++
                            }
                            break
                        case 'slot':
                            // 第一个修饰符dynamic代表定义动态插槽
                            htmlAst.isDynamicDefineSlotName = attr?.modifiers?.includes('dynamic')
                            htmlAst.defineSlotName = htmlAst.isDynamicDefineSlotName ? context.setRenderScope(attr?.value) : attr?.value
                            break
                        case 'slot-name':
                            // 使用插槽时的名称
                            htmlAst.isDynamicSlot = attr?.modifiers?.includes('dynamic')
                            htmlAst.slotName = htmlAst.isDynamicSlot ? context.setRenderScope(attr?.value) : (attr?.value || 'default')
                            break
                        case 'is':
                            let isDynamicIs = attr?.modifiers?.includes('dynamic')
                            htmlAst.isDynamicIs = isDynamicIs
                            if (isDynamicIs) {
                                htmlAst.is = context.setRenderScope(attr.value)
                            } else {
                                htmlAst.is = attr.value
                            }
                            break
                        case 'style':
                            attr.type = AstTypes.ATTRIBUTE_STYLE
                            attr.isDynamicValue = true
                            attr.value = context.setRenderScope(attr.value)
                            break
                        case 'class':
                            attr.type = AstTypes.ATTRIBUTE_CLASS
                            attr.isDynamicValue = true
                            attr.value = context.setRenderScope(attr.value)
                            break
                        case 'model':
                            if (htmlAst.type === AstTypes.COMPONENT) {
                                // _modelValue_????
                                let modelValue = context.setRawScope(attr.value)
                                attributes.push({
                                    type: AstTypes.ATTRIBUTE,
                                    property: `_modelValue_is_${attr?._arguments?.[0] || 'defaultModelValue'}`,
                                    value: modelValue,
                                    isDynamicValue: true,
                                    isDynamicProperty: false,
                                })
                                attributes.push({
                                    type: AstTypes.ATTRIBUTE,
                                    property: `onBeforeUpdate$modelValue_${attr?._arguments?.[0] || 'defaultModelValue'}`,
                                    value: toArrowFunction(`${modelValue} = _`, '_'),
                                    isDynamicValue: true,
                                    isDynamicProperty: false,
                                })
                            } else {
                                let supportModelTypes = ['text', 'raido', 'checkbox', 'selectMultiple', 'selectOne', 'color', 'range']
                                let modelType = htmlAst.tag === 'select' ?
                                    (hasOwn(htmlAst.rawAttributeMap, 'multiple') ?
                                        'selectMultiple' : 'selectOne') : (htmlAst.rawAttributeMap.type || 'text');
                                if (supportModelTypes.includes(modelType)) {
                                    attr.type = AstTypes.CUSTOM_DIRECTIVE;

                                    // transform 
                                    attr.property = `model${initialUpperCase(modelType)}`
                                    attr.value = context.setRawScope(attr.value)
                                    attributes.push({
                                        type: AstTypes.ATTRIBUTE,
                                        property: '_setModelValue',
                                        value: toArrowFunction(`${attr.value} = _`, '_'),
                                        isDynamicValue: true,
                                        isDynamicProperty: false
                                    })
                                    attributes.push({
                                        type: AstTypes.ATTRIBUTE,
                                        property: '_getModelValue',
                                        value: toArrowFunction(`${attr.value}`),
                                        isDynamicValue: true,
                                        isDynamicProperty: false
                                    })
                                }
                            }
                            break
                        case 'keep-alive':
                            attr.type = AstTypes.ATTRIBUTE
                            attr.property = '_keepAlive'
                            attr.isDynamicValue = true
                            let keepAliveOptions: any = {
                                // includes 和 excludes 只能包括一个 , 默认为includes
                                [attr?.modifiers?.includes('excludes') ? 'excludes' : 'includes']:
                                    attr.value ? attr?.modifiers?.includes('dynamic') ? attr.value : toBackQuotes(attr.value) : null,
                                // 第一个过滤器代表最多缓存数
                                max: attr?.filters?.[0] || null
                            }
                            attr.value = keepAliveOptions
                            break
                        default:
                            attr.type = AstTypes.CUSTOM_DIRECTIVE;
                            attr.value = context.setRenderScope(attr.value)
                            if (attr.isDynamicProperty) {
                                attr.property = context.setRenderScope(attr.property)
                            }
                            break
                    }
                    break
                case '@':
                    attr.type = AstTypes.EVENT
                    attr.isHandler = isHandler(attr.value)
                    attr.value = context.setRenderScope(attr.value || attr.property)
                    if (attr.isDynamicProperty) {
                        attr.property = context.setRenderScope(attr.property)
                    } else {
                        attr.property = camelize(attr.property)
                    }
                    break
                case '#':
                    if (htmlAst.tagName === 'template' || htmlAst.tagName === 'fragment') {
                        // 模板上的# 会转换为插槽的定义
                        if (attr.isDynamicProperty) {
                            htmlAst.isDynamicDefineSlotName = true
                            htmlAst.defineSlotName = context.setRenderScope(attr.property)
                        } else {
                            htmlAst.isDynamicDefineSlotName = false
                            htmlAst.defineSlotName = attr.property
                        }
                        htmlAst.slotScope = attr.value
                        let args = extractFunctionArgs(attr.value)
                        if (args.length) {
                            context.pushScope(args)
                            scopeStack++
                        }
                    } else {
                        attr.type = AstTypes.ATTRIBUTE
                        // id 如果是驼峰形式，则在模版中一定是连字符写法 ， 需要转回连字符形式
                        attr.property = 'id'
                        attr.isDynamicValue = attr.isDynamicProperty
                        attr.isDynamicProperty = false
                        attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property
                    }
                    break
                case '.':
                    attr.type = AstTypes.ATTRIBUTE_CLASS
                    attr.isDynamicValue = attr.isDynamicProperty
                    attr.isDynamicProperty = false
                    attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property
                    attr.property = 'class'
                    break
                case '...':
                    attr.type = AstTypes.ATTRIBUTE
                    attribute.property = 'bind'
                    attribute.isDynamicValue = true
                    attr.value = context.setRenderScope(attr.property)
                    break
                default:
                    attr.type = AstTypes.ATTRIBUTE
                    if (attr.isDynamicProperty) {
                        attr.property = context.setRenderScope(attr.property)
                    } else {
                        attr.property = camelize(attr.property)
                    }
                    if (!attr.value) {
                        attr.value = attr.property
                    }
                    if (attr.isDynamicValue) {
                        attr.value = context.setRenderScope(attr.value)
                    }
                    switch (attr.property) {
                        case 'class':
                            attr.type = AstTypes.ATTRIBUTE_CLASS
                            break
                        case 'style':
                            attr.type = AstTypes.ATTRIBUTE_STYLE
                            break
                    }

            }
        }
    }

    switch (tagName) {
        case '':
            htmlAst.type = AstTypes.TEXT
            let children = parseText(htmlAst.children)
            let isDynamic = false
            children.forEach((child: any) => {
                if (child.isDynamic) {
                    child.content = context.setRenderScope(child.content)
                    isDynamic = true
                }
            })
            htmlAst.isDynamic = isDynamic
            htmlAst.children = children
            htmlAst.ignoreChildren = true
            break
        case '!':
            htmlAst.type = AstTypes.HTML_COMMENT
            htmlAst.ignoreChildren = true
            break
        case 'if':
            htmlAst.type = AstTypes.CONDITION_RENDER_IF
            htmlAst.isBranchStart = true
            htmlAst.condition = context.setRenderScope(htmlAst.rawAttributeMap['condition'])
            break
        case 'elseIf':
            htmlAst.type = AstTypes.CONDITION_RENDER_ELSE_IF
            htmlAst.isBranch = true
            htmlAst.condition = context.setRenderScope(htmlAst.rawAttributeMap['condition'])
            break
        case 'else':
            htmlAst.type = AstTypes.CONDITION_RENDER_ELSE
            htmlAst.isBranch = true
            break
        case 'for':
            htmlAst.type = AstTypes.LIST_RENDER
            let iterator = parseIterator(htmlAst.rawAttributeMap['iterator'])
            iterator.iterable = context.setRenderScope(iterator.iterable)
            context.pushScope(iterator.items)
            scopeStack++
            htmlAst.iterator = iterator
            break
        case 'template':
        case 'fragment':
            htmlAst.type = AstTypes.FRAGMENT
            break
        case 'slot':
            htmlAst.type = AstTypes.USE_COMPONENT_SLOT
            break
        case 'element':
            htmlAst.type = AstTypes.DYNAMIC_HTML_ELEMENT
            break
        case 'component':
            htmlAst.type = AstTypes.DYNAMIC_COMPONENT
            break
        case 'svgElement':
            htmlAst.type = AstTypes.DYNAMIC_SVG_ELEMENT
            break
        case 'style':
            htmlAst.type = AstTypes.STYLESHEET
            var template = htmlAst.children?.[0].children
            if (template) {
                var styleAst = parseCSS(template, context)
                processRules(styleAst, context)
                htmlAst.children = styleAst
            }
            htmlAst.ignoreChildren = true
            break
    }

    if (htmlAst.children && !htmlAst.ignoreChildren) {
        processTemplateAst(htmlAst.children, context)
    }

    if (scopeStack) {
        for (let i = 0; i < scopeStack; i++) {
            context.popScope()
        }
    }
}