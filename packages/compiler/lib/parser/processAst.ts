// parse for codegen 


import { isArray ,camelize} from "@crush/common"
import { isHTMLTag, isSVGTag , keyOf, Nodes} from "@crush/const"
import { toArrowFunction } from "../stringify"
import { parseCSS } from "./parseCSS"
import { processRules } from "./processRules"
import { parseIterator } from "./parseIterator"
import { parseText } from "./parseText"
import { parseInlineClass, parseInlineStyle } from "./specialAttr"

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


var reservedDirMap: Record<string, Nodes> = {
    if: Nodes.IF,
    elseIf: Nodes.ELSE_IF,
    else: Nodes.ELSE,
    for: Nodes.FOR,
    slot: Nodes.SLOT,
    outlet: Nodes.OUTLET,
    model: Nodes.MODEL
}

const reservedAttributeMap: any = {
    style: Nodes.STYLE,
    class: Nodes.CLASS,
    created: true,
    beforeMount: true,
    mounted: true,
    beforeUpdate: true,
    updated: true,
    beforeUnmount: true,
    unmounted: true
}

function processAttribute(ast: any) {
    var attributes = ast.attributes
    if (!attributes) return
    for (let i = 0; i < attributes.length; i++) {
        var attribute = attributes[i]
        var { flag } = attribute
        if (flag === '@') {
            // event
            attribute.type = Nodes.EVENT
            attribute.isHandler = isHandler(attribute.value)
        } else if (flag === '--') {
            // direvtive
            const type = reservedDirMap[attribute.property]
            const isCustomDirective = attribute.isDynamicProperty || !type
            if (isCustomDirective) {
                (ast.customDirectives ||= []).push(attribute)
            } else {
                // reserved directive
                var directives = ast.directives ||= []
                switch (attribute.type = type) {
                    case Nodes.IF:
                        if (!directives.length) {
                            //  此时为元素的第一个指令为if ， 最外层的分支指令会注入到元素节点 ， 在代码生成时用作判断处理
                            ast.condition = attribute.value
                            ast.isBranchStart = true
                        } else {
                            directives.push(attribute)
                        }
                        break
                    case Nodes.ELSE_IF:
                        if (!directives.length) {
                            ast.isBranch = true
                        } else {
                            debugger
                            //! else-if 指令只会在第一个指令出现 error
                        }
                        break
                    case Nodes.ELSE:
                        if (!directives.length) {
                            ast.isBranch = true
                        } else {
                            debugger
                            // else-if 指令只会在第一个指令出现
                        }
                        break
                    case Nodes.FOR:
                        attribute.iterator = parseIterator(attribute.value)
                        directives.push(attribute)
                        break
                    case Nodes.SLOT:
                        directives.push(attribute)
                        break
                    case Nodes.OUTLET:
                        // define slot
                        ast.outlet = {
                            name: attribute._arguments[0], // 默认第一个参数为插槽名称
                            scope: attribute.value
                        }
                        break
                    case Nodes.MODEL:
                        const tagName = ast.tagName;
                        ast.attributes.unshift({
                            type: Nodes.RESERVED_PROP,
                            property: 'assigner',
                            isDynamicValue:true,
                            value: toArrowFunction(`${attribute.value}=_`, '_')
                        });
                        i++;
                        (ast.customDirectives ||= []).push(attribute)
                        break
                }
            }
        } else {            
            // 其他属性
            var type = reservedAttributeMap[attribute.property]
            if (attribute.flag === '#') {
                // id shorthand
                attribute.type = Nodes.ATTRIBUTE
                attribute.value = attribute.property
                attribute.property = 'id'
                attribute.isDynamicValue = attribute.isDynamicProperty
                attribute.isDynamicProperty = false
            } else if (attribute.flag === '.') {
                // class shourthand
                attribute.type = Nodes.CLASS
                attribute.value = attribute.property
                attribute.property = 'class'
                attribute.isDynamicValue = attribute.isDynamicProperty
                attribute.isDynamicProperty = false
            } else if (!type || attribute.isDynamicProperty) {
                attribute.type = Nodes.ATTRIBUTE
            } else {
                switch (type) {
                    case Nodes.STYLE:
                        attribute.type = Nodes.STYLE
                        attribute.value = attribute.isDynamicValue ? attribute.value : parseInlineStyle(attribute.value)
                        break
                    case Nodes.CLASS:
                        attribute.type = Nodes.CLASS
                        attribute.value = attribute.isDynamicValue ? attribute.value : parseInlineClass(attribute.value)
                        break
                    default:
                        // 自定义保留属性，不对外开放
                        attribute.type = Nodes.RESERVED_PROP
                }
            }
        }
    }
}

var reservedTagMap: Record<string, Nodes> = {
    if: Nodes.IF,
    elseIf: Nodes.ELSE_IF,
    else: Nodes.ELSE,
    for: Nodes.FOR,
    slot: Nodes.SLOT,
    outlet: Nodes.OUTLET,
    '': Nodes.TEXT,
    '!': Nodes.HTML_COMMENT,
    'template': Nodes.TEMPLATE,
    'component': Nodes.DYNAMIC_COMPONENT,
    'element': Nodes.DYNAMIC_ELEMENT,
    'style': Nodes.STYLE
}

/*
    tips 
    why should devide the componet and element tag
    bcause the children is different
*/



export function processAst(ast: any) {
    if (isArray(ast)) {
        ast.forEach(processAst)
        return
    }

    const tag = ast.tag
    const tagName = camelize(tag)
    ast.tagName = tagName
    processAttribute(ast)
    let ignoreChildren = false
    const type = reservedTagMap[tagName]
    if (type) {
        // reserved tag
        switch (ast.type = type) {
            case Nodes.HTML_COMMENT:
                break
            case Nodes.TEXT:
                ast.children = parseText(ast.children as string)
                ignoreChildren = true
                break
            case Nodes.STYLE:
                var template = ast.children?.[0].children
                if (template) {
                    var styleAst = parseCSS(template)
                    processRules(styleAst)
                    ast.children = styleAst
                }
                ignoreChildren = true
                break
            case Nodes.IF:
                ast.condition = ast.attributeMap['condition']
                ast.isBranchStart = true
                break
            case Nodes.ELSE_IF:
                ast.condition = ast.attributeMap['condition']
                ast.isBranch = true
                break
            case Nodes.ELSE:
                ast.isBranch = true
                break
            case Nodes.FOR:
                ast.iterator = parseIterator(ast.attributeMap['iterator'])
                break
            case Nodes.OUTLET:
                ast.outlet = {
                    name: ast.attributeMap?.['name'],
                    scope: ast.attributeMap?.['scope']
                }
                break
            case Nodes.DYNAMIC_ELEMENT:
                break
        }
    } else if (isHTMLTag(tagName)) {
        ast.type = Nodes.HTML_ELEMENT
    } else if (isSVGTag(tagName)) {
        ast.type = Nodes.SVG_ELEMENT
    } else {
        ast.type = Nodes.COMPONENT
    }

    if (!ignoreChildren && ast.children) {
        processAst(ast.children)
    }
}