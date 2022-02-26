
import { Nodes } from "../../type/nodeType"
import { createScanner } from "./scanner"

const openTag = /^<([\w-]+)(?:\:(\w+))?/
const closeTagEx = /^<\/([\w-]+)(?:\:\w+)?\s*>/
const comment = /<!--((.|[\r\n])*?)-->/
const text = /((?:\{\{.*?\}\}|[^<])+)/
const baseAttr = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/

export type DOMAttr = {
    attribute: string,
    value: string | undefined
}

export type DOMAstNode = {
    tag: string,
    tagName?: string
    content?: string
    condition?: string
    iterator?: any
    rules: any
    texts: any
    nodeType: Nodes
    attrs?: Array<DOMAttr>
    children: Array<DOMAstNode>
}

export type DOMAst = Array<DOMAstNode>

/* there is always return an array of the astTree, althrough only one root node */
export const parseHTML = (source:string): DOMAst => {
    var scanner = createScanner(source)
    var ast: any = [],
        attrs: any,
        inOpen = false,
        tag,
        modifier
    while (scanner.source) {
        if (scanner.expect('<')) {
            if (scanner.expect('/', 1)) {
                var closeTag = scanner.extract(closeTagEx)[0]
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
                ast.push({
                    tag: '!',
                    content: scanner.extract(comment)[0]
                })
            } else {
                [tag, modifier] = scanner.extract(openTag)
                inOpen = true
            }
        } else if (inOpen) {
            if (scanner.expect('/')) {
                /* there is not must for decide a opentag is close or not by '/', so just forget it */
                scanner.move(1)
            } else if (scanner.expect('>')) {
                ast.push({
                    tag,
                    modifier,
                    attrs,
                    children: null,
                    closed: false,
                })
                attrs = null
                inOpen = false
                scanner.move(1)
            } else {
                var [attribute, _, value] = scanner.extract(baseAttr);
                    (attrs ||= []).push({
                        attribute,
                        value
                    })
            }
        } else { // text
            ast.push({
                tag: '',
                content: scanner.extract(text)[0]
            })
        }
    }
    return ast
}