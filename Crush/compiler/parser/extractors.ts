const openTagRE = /^<([\w-]+)(?:\:(\w+))?/
/*
    $1 : tagName
    $2 : modifier
*/

const closeTagRE = /^<\/([\w-]+)\s*>/
/*
    $1 : tagName
    ignore the modifiers
*/

const DOMCommentRE = /<!--((.|[\r\n])*?)-->/
/*
    $1 : comment content
*/

const baseAttrRE = /([^=\s]+)\s*(?:=\s*(["'])([^\2]*?)\2)?/
/*
    $1 : attrName
    $2 : ' "
    $3 : value
*/

var textRE = /(.*?)(<|{{|}})/
/*
    $1 : content
    $2 : flag
*/


export {
    openTagRE,
    closeTagRE,
    DOMCommentRE,
    baseAttrRE,
    textRE
}