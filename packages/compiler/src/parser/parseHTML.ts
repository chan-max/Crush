import { createScanner } from "./scanner"

import {
    Nodes
} from '@crush/types'
import {
    createAsb,
    Asb
} from './ast'

const openTag = /^<([\w-]+)(?:\:(\w+))?/
/*
    return the tagName and the modifier,
    tips: when use inline-template, the endtag must contain the same modifier as open , or it will throw a compile error, 
*/
const closeTagEx = /^<\/([\w-]+)(?:\:\w+)?\s*>/
const comment = /<!--((.|[\r\n])*?)-->/

const textRE = /((?:\{\{.*?\}\}|[^<])+)/
// capture the mushache first 

const baseAttr = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/
// the value is wrap in ' and " , so just remember dont contain them

import {
    camelize,
    getEmptyMap
} from '@crush/common'

/* there is always return an array of the astTree, althrough only one root node */

export const parseHTML = (source: string): Asb[] => {
    var scanner = createScanner(source)
    var ast: Asb[] = [],
        attributes: any,
        attributeMap: any,
        inOpen: boolean = false,
        tag,
        modifier /* extend feature */
    while (scanner.source) {
        if (scanner.expect('<')) {
            if (scanner.expect('/', 1)) {
                var closeTag = scanner.exec(closeTagEx)[0]
                for (var i = ast.length - 1; i >= 0; i--) {
                    if (ast[i].closed) continue
                    if (ast[i].tag === closeTag) {
                        ast[i].closed = true
                        var children = ast.splice(i + 1)
                        if (children.length) {
                            ast[i].children = children
                        }
                        break
                    }
                }
            } else if (scanner.expect('!', 1)) {
                var asb = createAsb(Nodes.HTML_COMMENT)
                asb.children = scanner.exec(comment)[0]
                ast.push(createAsb(Nodes.HTML_COMMENT))
            } else {
                [tag, modifier] = scanner.exec(openTag)
                inOpen = true
            }
        } else if (inOpen) {
            if (scanner.expect('/')) {
                /* there is not must for decide a opentag is close or not by '/', so just forget it */
                scanner.move(1)
            } else if (scanner.expect('>')) {
                var asb = createAsb(Nodes.DOM_ELEMENT)
                asb.tag = tag
                asb.tagName = camelize(tag)
                asb.modifier = modifier
                asb.closed = false
                asb.attributes = attributes
                asb.attributeMap = attributeMap
                ast.push(asb)
                attributes = null
                attributeMap = null
                inOpen = false
                scanner.move(1)
            } else {
                /* catch attribute */
                var [attribute, _, value] = scanner.exec(baseAttr);
                var asb = createAsb(Nodes.HTML_ATTRIBUTE);
                asb.attribute = attribute
                asb.value = value;
                (attributes ||= []).push(asb);
                (attributeMap ||= getEmptyMap())[attribute] = value;
            }
        } else { // text

            var textEndsWithTag = /([\s\S]*?)<(\/?)[\w-]+/
            var textToken, text
            if ((textToken = textEndsWithTag.exec(scanner.source))) {
                text = textToken[1]
                scanner.move(text.length)
            } else {
                // text为结尾 , 直接读取所有内容，并清空
                text = scanner.source
                scanner.source = ''
            }

            var asb = createAsb(Nodes.TEXT)
            asb.children = text
            ast.push(asb)
        }
    }
    return ast
}