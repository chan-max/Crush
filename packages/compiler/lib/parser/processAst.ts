import { camelize, hasOwn, initialUpperCase, isArray, isUndefined } from "@crush/common"
import { isHTMLTag, isSVGTag, Nodes } from "@crush/const"
import { declare, toArrowFunction } from "../stringify"
import { parseIterator } from "./parseIterator"
import { parseText } from "./parseText"

import { parseCSS } from './parseCSS'
import { processRules } from './processRules'
import { parseAttribute } from "./parseAttribute"

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
        ast.condition = ast.rawAttributeMap.condition
        ast.isBranchStart = true
    },
    elseIf(ast: any) {
        ast.type = Nodes.ELSE_IF
        ast.condition = ast.rawAttributeMap.condition
        ast.isBranch = true
    },
    else(ast: any) {
        ast.type = Nodes.ELSE
        ast.isBranch = true
    },
    for(ast: any) {
        ast.type = Nodes.FOR
        ast.iterator = parseIterator(ast.rawAttributeMap.iterator)
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
        let name = ast?.attributeMap?.name
        name.type = Nodes.SKIP
        if (name) {
            ast.slotName = name.value
            ast.isDynamicSlot = name.isDynamicValue
        } else {
            ast.slotName = 'default'
            ast.isDynamicSlot = false
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

// 
const customDirectiveHandlers: any = {
    model(attribute: any, ast: any) {
        let modelType = ast.tag === 'select' ? (hasOwn(ast.rawAttributeMap,'multiple') ? 'selectMultiple' : 'selectOne' ) : ast.rawAttributeMap.type || 'text'
        // transform 
        attribute.property = `model${initialUpperCase(modelType)}`

        ast.attributes.unshift({
            type: Nodes.ATTRIBUTE,
            property: '_setter',
            value: toArrowFunction(`${attribute.value} = _`, '_'),
            isDynamicValue: true,
            isDynamicProperty: false
        })
    }
}

const builtInAttributes: any = {
    if(attr: any, ast: any) {
        attr.type = Nodes.IF
        const directives = ast.directives ||= []
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
    let rawAttributeMap = ast.rawAttributeMap ||= {}
    let attributeMap = ast.attributeMap ||= {}
    attributes.forEach((attr: any) => {
        rawAttributeMap[attr.attribute] = attr.value
        // parseAttribute 不传入两个字符串是为了复用节点
        let processedAttribute: any = parseAttribute(attr)
        attributeMap[attr.property] = processedAttribute
    });


    for (let i = 0; i < attributes.length; i++) {
        let attribute = attributes[i]
        let { flag, isDynamicProperty } = attribute
        if (flag === '@') {
            // event
            attribute.type = Nodes.EVENT
            attribute.isHandler = isHandler(attribute.value)
            if (!isDynamicProperty && builtInEvents[attribute.property]) {
                // 保留事件
                builtInEvents[attribute.property](attribute, ast)
            }
        } else if (flag === '--') {
            attribute.type = Nodes.CUSTOM_DIRECTIVE;
            // 这种形式出现的指令，都会是从外界注入的指令，只不过会出现动态或额外处理等情况
            const customDirectiveHandler = customDirectiveHandlers[attribute.property];
            (ast.customDirectives ||= []).push(attribute);
            if (!isDynamicProperty && customDirectiveHandler) {
                customDirectiveHandler(attribute, ast)
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
            // normal property , if for 等也会作为属性出现
            const attrHandler = builtInAttributes[attribute.property]
            if (!attrHandler || attribute.isDynamicProperty) {
                attribute.type = Nodes.ATTRIBUTE
            } else {
                ast.directives ||= []
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