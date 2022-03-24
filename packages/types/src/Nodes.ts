// all is nodes
export enum Nodes {

    NULL,

    FRAGMENT,

    IF,
    ELSE_IF,
    ELSE,
    FOR,

    SVG_ELEMENT,
    HTML_COMMENT,
    TEXT,
    HTML_ELEMENT,
    COMPONENT,

    STYLE,

    DYNAMIC_CLASS,
    STATIC_CLASS,
    DYNAMIC_STYLE,

    AT_RULE,

    MEDIA_RULE,
    SUPPORT_RULE,
    KEYFRAMES_RULE,
    MIXIN,


    STYLE_RULE,

    KEYFRAME_RULE,
    DECLARATION,

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
    '' = Nodes.TEXT,
    '!' = Nodes.HTML_COMMENT,
    '...' = Nodes.MIXIN,
    '@' = Nodes.AT_RULE,
    '--' = Nodes.DIRECTIVE_FLAG,
    'media' = Nodes.MEDIA_RULE,
    'keyframes' = Nodes.KEYFRAMES_RULE,
    'support' = Nodes.SUPPORT_RULE
}

import {
    isHTMLTag, isSVGTag
} from './const'

export const nodeTypeOf = (
    key: any,
) => {
    // this key is nodeType value
    return NodesMap[key] || (
        isHTMLTag(key) ? Nodes.HTML_ELEMENT : isSVGTag(key) ? Nodes.SVG_ELEMENT : Nodes.COMPONENT
    )
}
