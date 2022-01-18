import { tagTypeOf } from "../../common/tag-type/tagType"
import { camelize } from "../../common/string/transfrom"

import {
    NodeTypes,
} from '../types'

import {
    openTagRE,
    closeTagRE,
    DOMCommentRE,
    attributeMapRE,
    textRE1, textRE2
} from "./extractRE"

import { exec } from "./utils"

const parseDOMTemplate = (template: string) => {
    var ast = [],
        attributes: any = [],
        inOpenTag = false,
        subLength = 0,
        currentTagName,
        willExp = false,
        texts = []
        
    while (template = template.substring(subLength).trimStart()) {
        if (template[0] === '<') {
            if (texts.length) {
                ast.push({
                    type: NodeTypes.TEXT,
                    texts
                })
                texts = []
            }
            if (template[1] === '/') { /* close */
                let [{ length }, tagName]: any = exec(closeTagRE, template)
                for (var i = ast.length - 1; i >= 0; i--) {
                    if (ast[i].closed) continue
                    if (ast[i].tagName === tagName) {
                        ast[i].closed = true
                        var children = ast.splice(i + 1)
                        if (children) {
                            ast[i].children = children
                        }
                        break
                    }
                }
                subLength = length
            } else if (template[1] === '!') {  /* comment  */
                let [{ length }, comment]: any = DOMCommentRE.exec(template)
                ast.push({
                    type: NodeTypes.COMMENT,
                    comment
                })
                subLength = length
            } else { /* open */
                let [{ length }, tagName, modifier]: any = openTagRE.exec(template)
                currentTagName = camelize(tagName)
                inOpenTag = true
                subLength = length
            }
        } else if (inOpenTag) { /* attributes */
            if (template[0] === '/') {
                /* there is not must for decide a opentag is close or not by '/' */
                subLength = 1
            } else if (template[0] === '>') {
                /*   tag close  */
                var token: any = {
                    tagName: currentTagName,
                    attributes,
                    type: tagTypeOf(currentTagName),
                    children: [],
                    closed: false
                }
                ast.push(token)
                /* reset status */
                attributes = [], inOpenTag = false, currentTagName = '', subLength = 1
            } else {  /*   catch the attr map  */
                let [{ length }, flag, attrL, attributeName, attrR, modifiers, _, value]: any = exec(attributeMapRE, template)
                attributes.push({
                    type: flag === '@' ? NodeTypes.EVENT : flag === '--' ? NodeTypes.DIRECTIVE : NodeTypes.NORMAL,
                    attributeName, value,
                    dynamicAttribute: attrL && attrR,
                    dynamicValue: flag === '$' || flag === '@',
                    modifiers: modifiers && modifiers.split('.')
                })
                subLength = length
            }
        } else if (!willExp) {
            let [{ length }, text, willExpression]: any = exec(textRE1, template)
            texts.push({
                text,
                dynamic: false,
            })
            willExp = willExpression
            subLength = length
        } else if (willExp) {
            let [{ length }, text]: any = exec(textRE2, template)
            texts.push({
                text,
                dynamic: true,
            })
            subLength = length
            willExp = false
        }
    }
    return ast
}

export {
    parseDOMTemplate
}





