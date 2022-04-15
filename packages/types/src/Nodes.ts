// all is nodes
export enum Nodes {

    NULL, /* null */

    FRAGMENT, /* fragment for fragment tag , css directive */

    IF,
    ELSE_IF,
    ELSE,
    FOR,

    HTML_ATTRIBUTE,

    DOM_ELEMENT,

    SVG_ELEMENT,
    HTML_COMMENT,
    TEXT,
    HTML_ELEMENT,
    COMPONENT,

    STYLE,

    DYNAMIC_CLASS,
    STATIC_CLASS,
    DYNAMIC_STYLE,

    AT,

    MEDIA_RULE,
    SUPPORT_RULE,
    KEYFRAMES_RULE,

    EVENT, // events , elements and components

    STYLE_RULE,

    KEYFRAME_RULE,

    DECLARATIONS,
    DECLARATION,
    MIXIN,

    UNKNOWN,

    DIRECTIVE_FLAG,

    BUILTIN_DIRECTIVE,
    CUSTOM_DIRECTIVE
}

/*
    input nodeType return nodeKeyword
    input nodeKeyword return nodeType
*/
export enum NodesMap {
    'if' = Nodes.IF,
    'elseIf' = Nodes.ELSE_IF,
    'else' = Nodes.ELSE,
    'for' = Nodes.FOR,
    '...' = Nodes.MIXIN,
    '@' = Nodes.AT,
    '--' = Nodes.DIRECTIVE_FLAG,
    'media' = Nodes.MEDIA_RULE,
    'keyframes' = Nodes.KEYFRAMES_RULE,
    'support' = Nodes.SUPPORT_RULE,
    'style' = Nodes.STYLE
}

import {
    isHTMLTag, isSVGTag
} from './const'

export const directiveTypeOf = (dirName: string) => {
    return NodesMap[dirName as any] || Nodes.CUSTOM_DIRECTIVE
}

export const tagTypeOf = (tagName: string) => {
    return NodesMap[tagName as any] ||
        (isHTMLTag(tagName) ?
            Nodes.HTML_ELEMENT : isSVGTag(tagName) ?
                Nodes.SVG_ELEMENT : Nodes.COMPONENT)
}

