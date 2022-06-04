
import {
    parseHTML
} from './parseHTML'

import {
    isArray, error
} from '@crush/common'

import {
    camelize
} from '@crush/common'

import {
    Nodes,
    tagTypeOf
} from '@crush/core'

import {
    parseText,
    Text
} from './parseText'

import {
    parseIterator
} from './parseIterator'

import {
    parseCSS
} from './parseCSS'
import {
    findValueByattribute,
    processAttribute
} from './processAttribute'

import {
    processRules
} from './processRules'




export const parseTemplate = (template: string) => {
    var htmlAst = parseHTML(template)
    processNodes(htmlAst)
    return htmlAst
}


// need to rewrite
const processNodes = (node: any) => {
    if (isArray(node)) {
        node.forEach(processNodes)
        return
    }
    
    // 正常处理节点
    let ignoreChildren = false
    const type = node.type
    if (type === Nodes.DOM_ELEMENT) {
        const tagType = tagTypeOf(node.tagName as string)
        node.type = tagType
        processAttribute(node)
        switch (tagType) {
            case Nodes.STYLE:
                var template = node.children?.[0].children
                if (template) {
                    var styleAst = parseCSS(template)
                    processRules(styleAst)
                    node.children = styleAst
                }
                ignoreChildren = true
                break
            case Nodes.IF:
                node.condition = node.attributeMap['condition']
                node.isBranchStart = true
                break
            case Nodes.ELSE_IF:
                node.condition = node.attributeMap['condition']
                node.isBranch = true
                break
            case Nodes.ELSE:
                node.isBranch = true
                break
            case Nodes.FOR:
                node.iterator = parseIterator(node.attributeMap['iterator'])
                break
            case Nodes.OUTLET:
                node.outlet = {
                    name: node.attributeMap?.['name'],
                    scope: node.attributeMap?.['scope']
                }
                break
        }
    } else if (type === Nodes.TEXT) {
        node.children = parseText(node.children as string)
        ignoreChildren = true
        return
    } else if (type === Nodes.HTML_COMMENT) {
        // todo
    }

    if(!ignoreChildren && node.children){
        processNodes(node.children)
    }

}