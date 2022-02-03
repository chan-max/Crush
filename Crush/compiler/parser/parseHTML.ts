import {
    trimS,
} from './utils'

const openTagRE = /^<([\w-]+)(?:\:(\w+))?/
const closeTagRE = /^<\/([\w-]+)(?:\:\w+)?\s*>/
const commentRE = /<!--((.|[\r\n])*?)-->/
const textRE = /((?:\{\{.*?\}\}|[^<])+)/

/*
    capture the property and value
    $1 : rawProperty
    $2 : the value border , " or ' , we can use except the border in value content , but the ast doesnt need the border
    $3 : the value , the value maybe 'undefined' or empty string , we should to diff the normal property or single property by 'undefined or empty string 
*/
const baseAttrRE = /([^=\s>]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/

export const parseHTML = (ts: string) => {
    var ast: any = [],
        attrs: any, /* use array bbut not map beacuse ,we may support the repeated property and keep the order */
        inOpen = false,
        sl = 0,
        $: any,
        tag,
        modifier /* why need the parse the modifier here, because we need to process the nesting domtree by tagName  */
    while (ts = trimS(ts, sl)) {
        if (ts[0] === '<') {
            if (ts[1] === '/') {
                $ = closeTagRE.exec(ts)
                for (var i = ast.length - 1; i >= 0; i--) {
                    if (ast[i].closed) continue
                    if (ast[i].tag === $[1]) {
                        ast[i].closed = true
                        var children = ast.splice(i + 1)
                        if (children.length) {
                            ast[i].children = children
                        }
                        break
                    }
                }
                sl = $[0].length
            } else if (ts[1] === '!') {
                $ = commentRE.exec(ts)
                ast.push({
                    tag: '!',
                    content: $[1]
                })
                sl = $[0].length
            } else {
                $ = openTagRE.exec(ts)
                tag = $[1]
                modifier = $[2]
                inOpen = true
                sl = $[0].length
            }
        } else if (inOpen) {
            if (ts[0] === '/') {
                /* there is not must for decide a opentag is close or not by '/', so just forget it */
                sl = 1
            } else if (ts[0] === '>') {
                ast.push({
                    tag,
                    modifier,
                    attrs,
                    children: null,
                    closed: false,
                })
                attrs = null
                inOpen = false
                sl = 1
            } else {
                $ = baseAttrRE.exec(ts);
                attrs = attrs || (attrs = [])
                attrs.push({
                    attribute: $[1],
                    value: $[3]
                })
                sl = $[0].length
            }
        } else {
            $ = textRE.exec(ts)
            ast.push({
                tag: '',
                content: $[1]
            })
            sl = $[0].length
        }
    }
    return ast
}