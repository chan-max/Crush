import { getEmptyObject } from "@crush/common";
import { parseAttribute } from "./parseAttribute";
import { createScanner } from "./scanner";

const openTagRE = /^<([\w-]+)(?:\.([\w\.]+))?/
var closeTagRE = /^<\/([\w-]+)(?:\.[\w\.]+)?\s*>/
const htmlCommentRE = /<!--((.|[\r\n])*?)-->/
const attributeRE = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/
var textEndsWithTag = /([\s\S]*?)<(\/?)[\w-]+/

export function baseParseHTML(template: string) {
    var scanner = createScanner(template)
    var ast: any = [],
        attributes,
        attributeMap, //! duplicate names will be overwritten
        inOpen,
        tag,
        modifiers;
    while (scanner.source) {
        if (scanner.startsWith('<')) {
            if (scanner.at(1) === '/') {
                // tag close
                var exRes: any = scanner.exec(closeTagRE)
                var closeTag = exRes[0]
                for (let i = ast.length - 1; i >= 0; i--) {
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
            } else if (scanner.at(1) === '!') {
                var exRes: any = scanner.exec(htmlCommentRE)
                ast.push({
                    tag: '!',
                    children: exRes[0]
                })
            } else {
                var exRes: any = scanner.exec(openTagRE)
                tag = exRes[0]
                modifiers = exRes[1]
                inOpen = true
            }
        } else if (inOpen) {
            if (scanner.startsWith('/')) {
                scanner.move(1) // ignore
            } else if (scanner.startsWith('>')) {
                // open tag close
                ast.push({
                    tag,
                    closed: false,
                    attributes,
                    attributeMap,
                    children: null,
                    modifiers: modifiers && modifiers.split(':')
                })
                tag = null
                modifiers = null
                attributes = null
                attributeMap = null
                inOpen = false
                scanner.move(1)
            } else {
                /* catch attribute */
                var exRes: any = scanner.exec(attributeRE);
                var attribute = exRes[0]
                var value = exRes[2];
                (attributes ||= []).push({
                    attribute,
                    value
                });
            }
        } else {
            var textToken, text
            if ((textToken = textEndsWithTag.exec(scanner.source))) {
                text = textToken[1]
                scanner.move(text.length)
            } else {
                // text为结尾 , 直接读取所有内容，并清空
                text = scanner.source
                scanner.source = ''
            }
            ast.push({
                tag: '',
                children: text.trim()
            })
        }
    }
    return ast
}