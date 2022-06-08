import { camelize, isArray } from "@crush/common"
import { isHTMLTag, isSVGTag, Nodes } from "@crush/const"
import { toArrowFunction } from "../stringify"
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
        ast.condition = ast.attributeMap['condition']
        ast.isBranchStart = true
    },
    elseIf(ast: any) {
        ast.type = Nodes.ELSE_IF
        ast.condition = ast.attributeMap['condition']
        ast.isBranch = true
    },
    else(ast: any) {
        ast.type = Nodes.ELSE
        ast.isBranch = true
    },
    for(ast: any) {
        ast.type = Nodes.FOR
        ast.iterator = parseIterator(ast.attributeMap['iterator'])
    },
    template(ast: any) {
        ast.type = Nodes.TEMPLATE
    },
    slot(ast: any) {
        ast.type = Nodes.SLOT
    },
    component(ast: any) {
        ast.type = Nodes.DYNAMIC_COMPONENT
    },
    element(ast: any) {
        ast.type = Nodes.DYNAMIC_ELEMENT
    },
    style(ast: any) {
        ast.type = Nodes.STYLE
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

    },
    html(attr: any, ast: any) {

    },
    slot(attr: any, ast: any) {
        attr.type = Nodes.SLOT
        ast.directives.push(attr)
    }
}

const builtInAttributes: any = {
    style(attr: any, ast: any) {
        attr.type = Nodes.STYLE
        attr.value = attr.isDynamicValue ? attr.value : parseInlineStyle(attr.value)
    },
    class(attr: any, ast: any) {
        attr.type = Nodes.CLASS
        attr.value = attr.isDynamicValue ? attr.value : parseInlineClass(attr.value)
    }
}


function processAttribute(ast: any) {
    var attributes = ast.attributes
    if (!attributes) return
    for (let i = 0; i < attributes.length; i++) {
        var attribute = attributes[i]
        var { flag, } = attribute
        if (flag === '@') {
            // event
            attribute.type = Nodes.EVENT
            attribute.isHandler = isHandler(attribute.value)
        } else if (flag === '--') {
            const dirHandler = builtInDirectives[attribute.property]
            const isCustomDirective = attribute.isDynamicProperty || !dirHandler
            if (isCustomDirective) {
                // 自定义指令会作为props的一部分
                attribute.type = Nodes.CUSTOM_DIRECTIVE
            } else {
                ast.directives ||= []
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