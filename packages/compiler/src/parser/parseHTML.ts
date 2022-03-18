import { createScanner } from "./scanner"

import {
    Nodes
} from '@crush/types'

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

export type HTMLAttribute = {
    attribute: string,
    value: string | undefined
    /*
        undefined is single attribute
    */
}

export type HTMLNode= {
    tag: string,
    modifier?: string | undefined
    closed?: boolean
    attributes?: HTMLAttribute[]
    children?: Array<HTMLNode> | string
}

/* there is always return an array of the astTree, althrough only one root node */

export const parseHTML = (source: string): HTMLNode[] => {
    var scanner = createScanner(source)
    var ast: HTMLNode[] = [],
        attributes: HTMLAttribute[] | undefined,
        inOpen: boolean = false,
        tag,
        modifier
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
                ast.push({
                    tag: '!',
                    children: scanner.exec(comment)[0]
                })
            } else {
                [tag, modifier] = scanner.exec(openTag)
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
                    attributes,
                    closed: false,
                })
                attributes = undefined
                inOpen = false
                scanner.move(1)
            } else {
                var [attribute, _, value] = scanner.exec(baseAttr);
                (attributes ||= []).push({
                    attribute,
                    value
                })
            }
        } else { // text
            ast.push({
                tag: '',
                children: scanner.exec(textRE)[0]
            })
        }
    }
    return ast
}