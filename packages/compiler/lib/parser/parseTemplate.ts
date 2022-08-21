import { camelize, error, hasOwn, hyphenate, initialUpperCase, isArray } from "@crush/common";
import { CodeGenerator } from "../generator/compiler";
import { toArrowFunction } from "../stringify";
import { extractArrayFunctionArgs } from "../withScope";
import { parseAttribute } from "./parseAttribute";
import { parseCSS } from "./parseCSS";
import { parseIterator } from "./parseIterator";
import { parseText } from "./parseText";
import { processRules } from "./processRules";
// legal variable name
var varRE = /^\w+$/
// arrow function
var arrowFnRE = /\(?[\w,\s]*\)?\s*=>\s*.*/
// normal function
var fnRE = /function[\w\s]*\([\w,\s]*\)\s*{.*}/
// array
var arrayRE = /\[.*\]/

function isHandler(exp: string) {
    return varRE.test(exp) || arrowFnRE.test(exp) || fnRE.test(exp) || arrayRE.test(exp)
}



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
            let { attribute, value } = attr
            switch (attribute) {
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
                case 'elseIf':
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
                    attr.property = attr.attribute
                    attr.value = context.setRenderScope(attr.value)
                    attr.isDynamicValue = true
                    break
                case 'native':
                    if (htmlAst.tagName == 'style') {
                        attr.type = AstTypes.ATTRIBUTE
                        attr.property = 'innerHTML'
                        attr.value = htmlAst.children[0].children
                        break
                    }
                case 'scoped':
                    if (htmlAst.tagName == 'style') {
                        htmlAst.scoped = true
                        break
                    }
                default:
                    // 深度解析
                    parseAttribute(attr)
                    switch (attr.flag) {
                        case '@':
                            attr.type = AstTypes.EVENT
                            attr.isHandler = isHandler(attr.value)
                            attr.value = context.setRenderScope(attr.value)
                            if (attr.isDynamicProperty) {
                                attr.property = context.setRenderScope(attr.property)
                            }
                            break
                        case '--':
                            attr.type = AstTypes.CUSTOM_DIRECTIVE;
                            (htmlAst.customDirectives ||= []).push(attr);
                            attr.value = context.setRenderScope(attr.value)
                            if (attr.isDynamicProperty) {
                                attr.property = context.setRenderScope(attr.property)
                            }
                            if (!attr.isDynamicProperty) {
                                if (attr.property === 'model') {
                                    let modelType = htmlAst.tag === 'select' ? (hasOwn(htmlAst.rawAttributeMap, 'multiple') ? 'selectMultiple' : 'selectOne') : htmlAst.rawAttributeMap.type || 'text'
                                    // transform 
                                    attr.property = `model${initialUpperCase(modelType)}`
                                    attributes.push({
                                        type: AstTypes.ATTRIBUTE,
                                        property: '_setter',
                                        attribute: '_setter', // 用于跳过属性解析
                                        value: toArrowFunction(`${attr.value} = _`, '_'),
                                        isDynamicValue: true,
                                        isDynamicProperty: false
                                    })
                                }
                            }
                            break
                        case '#':
                            if (htmlAst.tagName === 'template' || htmlAst.tagName === 'fragment') {
                                // 模板上的# 会转换为插槽的定义
                                if (attr.isDynamicProperty) {
                                    htmlAst.isDynamicDefineSlotName = true
                                    htmlAst.defineSlotName = context.setRenderScope(htmlAst.defineSlotName)
                                } else {
                                    htmlAst.isDynamicDefineSlotName = false
                                    htmlAst.defineSlotName = attr.property
                                }
                                htmlAst.slotScope = attr.value
                                let args = extractArrayFunctionArgs(attr.value)
                                if (args.length) {
                                    context.pushScope(args)
                                    scopeStack++
                                }
                            } else {
                                attr.type = AstTypes.ATTRIBUTE
                                // id 如果是驼峰形式，则在模版中一定是连字符写法 ， 需要转回连字符形式
                                attr.property = 'id'
                                attr.isDynamicProperty = false
                                attr.isDynamicValue = attr.isDynamicProperty
                                attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property
                            }
                            break
                        case '.':
                            attr.type = AstTypes.ATTRIBUTE_CLASS
                            attr.isDynamicProperty = false
                            attr.property = 'class'
                            attr.isDynamicValue = attr.isDynamicProperty
                            attr.value = attr.isDynamicValue ? context.setRenderScope(attr.property) : attr.property
                            break
                        case '...':
                            attr.type = AstTypes.ATTRIBUTE
                            attribute.property = 'bind'
                            attribute.isDynamicValue = true
                            attr.value = context.setRenderScope(attr.property)
                            break
                        default:
                            switch (attr.property) {
                                case 'slot':
                                    htmlAst.defineSlotName = attr?._arguments?.[0] || 'default'
                                    htmlAst.isDynamicDefineSlotName = false // todo 暂时不支持动态定义插槽
                                    htmlAst.slotScope = attr.value
                                    let args = extractArrayFunctionArgs(attr.value)
                                    if (args.length) {
                                        context.pushScope(args)
                                        scopeStack++
                                    }
                                    break
                                case 'style':
                                    attr.type = AstTypes.ATTRIBUTE_STYLE
                                    if (attr.isDynamicValue) {
                                        attr.value = context.setRenderScope(attr.value)
                                    }
                                    break
                                case 'class':
                                    attr.type = AstTypes.ATTRIBUTE_CLASS
                                    if (attr.isDynamicValue) {
                                        attr.value = context.setRenderScope(attr.value)
                                    }
                                    break
                                default:
                                    // 普通属性
                                    attr.type = AstTypes.ATTRIBUTE
                                    if (attr.isDynamicProperty) {
                                        attr.property = context.setRenderScope(attr.property)
                                    }
                                    if (attr.isDynamicValue) {
                                        attr.value = context.setRenderScope(attr.value)
                                    }
                            }
                    }
                    break
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
            let nameAttribute = htmlAst.attributes.find((attr: any) => attr.property === 'name')
            if (nameAttribute) {
                nameAttribute.type = AstTypes.SKIP
                if (nameAttribute.isDynamicValue) {
                    htmlAst.slotName = context.setRenderScope(nameAttribute.value)
                    htmlAst.isDynamicSlot = true
                } else {
                    htmlAst.slotName = nameAttribute.value
                    htmlAst.isDynamicSlot = false
                }
            } else {
                htmlAst.slotName = 'default'
                htmlAst.isDynamicSlot = false
            }
            break
        case 'element':
            htmlAst.type = AstTypes.DYNAMIC_HTML_ELEMENT
            var isAttribute = htmlAst.attributes.find((attr: any) => attr.property === 'is')
            isAttribute.type = AstTypes.SKIP
            if (isAttribute.isDynamicValue) {
                htmlAst.is = context.setRenderScope(isAttribute.value)
                htmlAst.isDynamicIs = true
            } else {
                htmlAst.is = isAttribute.value
                htmlAst.isDynamicIs = false
            }
            break
        case 'component':
            htmlAst.type = AstTypes.DYNAMIC_COMPONENT
            var isAttribute = htmlAst.attributes.find((attr: any) => attr.property === 'is')
            isAttribute.type = AstTypes.SKIP
            if (isAttribute.isDynamicValue) {
                htmlAst.is = context.setRenderScope(isAttribute.value)
                htmlAst.isDynamicIs = true
            } else {
                htmlAst.is = isAttribute.value
                htmlAst.isDynamicIs = false
            }
            break
        case 'svgElement':
            htmlAst.type = AstTypes.DYNAMIC_SVG_ELEMENT
            var isAttribute = htmlAst.attributes.find((attr: any) => attr.property === 'is')
            isAttribute.type = AstTypes.SKIP
            if (isAttribute.isDynamicValue) {
                htmlAst.is = context.setRenderScope(isAttribute.value)
                htmlAst.isDynamicIs = true
            } else {
                htmlAst.is = isAttribute.value
                htmlAst.isDynamicIs = false
            }
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