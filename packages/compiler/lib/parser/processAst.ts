import { camelize, isArray } from "@crush/common"
import { isHTMLTag, isSVGTag, Nodes } from "@crush/const"
import { declare, toArrowFunction } from "../stringify"
import { parseIterator } from "./parseIterator"
import { parseText } from "./parseText"
import { parseInlineClass, parseInlineStyle } from "./specialAttr"
import { parseCSS } from './parseCSS'
import { processRules } from './processRules'
import { model } from "@crush/builtin/lib/directiveFormModel"
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

const builtInTags: Record<string, any> = {
    ''(ast: any) {
        ast.type = Nodes.TEXT
        ast.children = parseText(ast.children as string)
        ast.ignoreChildren = true
    },
    '!'(ast: any) {
        ast.type = Nodes.HTML_COMMENT
        ast.ignoreChildren = true
    },
    if(ast: any) {
        ast.type = Nodes.IF
        ast.condition = ast.attributeMap['condition'].value
        ast.isBranchStart = true
    },
    elseIf(ast: any) {
        ast.type = Nodes.ELSE_IF
        ast.condition = ast.attributeMap['condition'].value
        ast.isBranch = true
    },
    else(ast: any) {
        ast.type = Nodes.ELSE
        ast.isBranch = true
    },
    for(ast: any) {
        ast.type = Nodes.FOR
        ast.iterator = parseIterator(ast.attributeMap['iterator'].value)
    },
    template(ast: any) {
        ast.type = Nodes.TEMPLATE
    },
    // ! 新策略 slot 标签用于使用插槽 ， slot指令用于定义插槽
    slot(ast: any) {
        ast.type = Nodes.SLOT
        // 插槽名称支持动态， 作用域不支持动态
        // ! slot need : slotName , isDynamicSlot 
        ast.type = Nodes.SLOT
        const attr = ast.attributeMap
        if (attr?.name) {
            attr.name.type = Nodes.SKIP
            ast.slotName = attr.name.value
            ast.isDynamicSlot = attr.name.isDynamicValue
        } else {
            ast.slotName = 'default'
        }
    },
    component(ast: any) {
        ast.type = Nodes.DYNAMIC_COMPONENT
        const is = ast.attributeMap.is
        const { isDynamicValue, value } = is
        ast.is = value
        ast.isDynamicIs = isDynamicValue
        is.type = Nodes.SKIP
    },
    element(ast: any) {
        ast.type = Nodes.DYNAMIC_ELEMENT
        const is = ast.attributeMap.is
        const { isDynamicValue, value } = is
        ast.is = value
        ast.isDynamicIs = isDynamicValue
        is.type = Nodes.SKIP
    },
    style(ast: any) {
        ast.type = Nodes.STYLE
        var template = ast.children?.[0].children
        if (template) {
            var styleAst = parseCSS(template)
            processRules(styleAst)
            ast.children = styleAst
        }
        ast.ignoreChildren = true
    }
}

// 新策略指令作为props一部分
const builtInDirectives: any = {
    if(attr: any, ast: any) {
        attr.type = Nodes.IF
        const directives = ast.directives
        if (!directives.length) {// 为元素的第一个指令
            ast.condition = attr.value
            ast.isBranchStart = true
        } else {
            directives.push(attr)
        }
    },
    elseIf(attr: any, ast: any) {
        attr.type = Nodes.ELSE_IF
        if (!ast.directives.length) {
            ast.isBranch = true
            ast.condition = attr.value
        }
    },
    else(attr: any, ast: any) {
        attr.type = Nodes.ELSE
        ast.isBranch = true
    },
    for(attr: any, ast: any) {
        attr.type = Nodes.FOR
        attr.iterator = parseIterator(attr.value)
        ast.directives.push(attr)
    },
    text(attr: any, ast: any) {
        attr.type = Nodes.ATTRIBUTE
        attr.property = 'innerText'
        attr.isDynamicValue = true
        ast.children = null // 直接忽略
    },
    html(attr: any, ast: any) {
        attr.type = Nodes.ATTRIBUTE
        attr.property = 'innerHTML'
        attr.isDynamicValue = true
        ast.children = null // 直接忽略
    },
    slot(attr: any, ast: any) {
        // ! slot 指令用于定义插槽 ， 可用于单个元素和 template （fragment）, 需要定义 slotName 
        /*
            注意当插槽指令作用于插槽标签时，代表当前定义插槽为上一个插槽传递的内容
        */
        attr.type = Nodes.SKIP
        // 定义插槽无动态插槽 , 第一个参数为slot的名称
        ast.defineSlotName = attr?._arguments?.[0]
        ast.slotScope = attr.value
    },
    model(attr: any, ast: any) {
        // 是否需要支持动态的 input type 类型 , 如果需要支持动态 ，就需要在指令中判断类型 , 暂不支持
        attr.type = Nodes.CUSTOM_DIRECTIVE
        const modelValue = attr.value
        // change model value
        ast.attributes.push({
            type: Nodes.ATTRIBUTE,
            property: '_changeModelValue',
            value: toArrowFunction(`${modelValue} = _`, '_'),
            isDynamicValue: true,
        })
        switch (ast?.attributeMap?.type?.value || 'text') {
            case 'text':
                attr.property = 'modelText'
                break
            case 'color':
                attr.property = 'modelColor'
                break
        }
        ast.customDirectives.push(attr)
    }
}

const builtInAttributes: any = {
    style(attr: any, ast: any) {
        attr.type = Nodes.STYLE
        // attr.value = attr.isDynamicValue ? attr.value : parseInlineStyle(attr.value)
    },
    class(attr: any, ast: any) {
        attr.type = Nodes.CLASS
        // attr.value = attr.isDynamicValue ? attr.value : parseInlineClass(attr.value)
    }
}

const builtInEvents: any = {
    hook(attr: any, ast: any) {
        attr.type = Nodes.SKIP
        const hooks = attr._arguments
        hooks.forEach((hook: string) => {
            ast.attributes.push({
                property: '_' + hook, // 作为保留属性
                value: attr.value,
                isDynamicProperty: false,
                isDynamicValue: true
            })
        })
    }
}


function processAttribute(ast: any) {
    var attributes = ast.attributes
    if (!attributes) return
    for (let i = 0; i < attributes.length; i++) {
        var attribute = attributes[i]
        var { flag, isDynamicProperty } = attribute
        if (flag === '@') {
            // event
            attribute.type = Nodes.EVENT
            attribute.isHandler = isHandler(attribute.value)
            if (!isDynamicProperty && builtInEvents[attribute.property]) {
                // 保留事件
                builtInEvents[attribute.property](attribute, ast)
            }
        } else if (flag === '--') {
            const dirHandler = builtInDirectives[attribute.property]
            const isCustomDirective = isDynamicProperty || !dirHandler
            if (isCustomDirective) {
                // 自定义指令不会作为props的一部分
                attribute.type = Nodes.CUSTOM_DIRECTIVE;
                (ast.customDirectives ||= []).push(attribute)
            } else {
                ast.directives ||= []
                ast.customDirectives ||= []
                dirHandler(attribute, ast)
            }
        } else if (flag === '#') {
            // id shorthand
            attribute.type = Nodes.ATTRIBUTE
            attribute.value = attribute.property
            attribute.property = 'id'
            attribute.isDynamicValue = attribute.isDynamicProperty
            attribute.isDynamicProperty = false
        } else if (flag === '.') {
            // class shourthand
            attribute.type = Nodes.CLASS
            attribute.value = attribute.property
            attribute.property = 'class'
            attribute.isDynamicValue = attribute.isDynamicProperty
            attribute.isDynamicProperty = false
        } else {
            // normal property
            const attrHandler = builtInAttributes[attribute.property]
            if (!attrHandler || attribute.isDynamicProperty) {
                attribute.type = Nodes.ATTRIBUTE
            } else {
                attrHandler(attribute, ast)
            }
        }
    }
}

export function processAst(ast: any) {
    if (isArray(ast)) {
        ast.forEach(processAst)
        return
    }
    const tag = ast.tag
    const tagName = camelize(tag)
    ast.tagName = tagName
    processAttribute(ast)
    if (builtInTags[tagName]) {
        builtInTags[tagName](ast)
    } else if (isHTMLTag(tagName)) {
        ast.type = Nodes.HTML_ELEMENT
    } else if (isSVGTag(tagName)) {
        ast.type = Nodes.SVG_ELEMENT
    } else {
        ast.type = Nodes.COMPONENT
    }
    if (!ast.ignoreChildren && ast.children) {
        processAst(ast.children)
    }
}