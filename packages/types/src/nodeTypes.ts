
export const enum NodeTypes {
    NULL,

    IF,
    ELSE_IF,
    ELSE,
    FOR,
    TEXT = 666,
    HTML_ELEMENT,
    SVG_ELEMENT,
    COMPONENT,

    HTML_COMMENT,

    STYLESHEET,
    STYLE_RULE,
    MEDIA_RULE,
    SUPPORT_RULE,
    KEYFRAMES_RULE,
    KEYFRAME_RULE,
    DECLARATION,
    MIXIN,

    UNKNOWN
}

export const nodeTypeMap: Record<string, NodeTypes> = {
    'media': NodeTypes.MEDIA_RULE,
    'keyframes': NodeTypes.KEYFRAMES_RULE,
    'support': NodeTypes.SUPPORT_RULE,
    'if': NodeTypes.IF,
    'elseIf': NodeTypes.ELSE_IF,
    'else': NodeTypes.ELSE,
    'for': NodeTypes.FOR,
    '': NodeTypes.TEXT,
    '!': NodeTypes.HTML_COMMENT,
    'style': NodeTypes.STYLESHEET,
    'svg': NodeTypes.SVG_ELEMENT
}

import {
    isHTMLTag
} from './HTMLTag'
import {
    isSVGTag
} from './SVGTag'

export const nodeTypeOf = (key: string) => {
    return nodeTypeMap[key] || (isHTMLTag(key) ?
        NodeTypes.HTML_ELEMENT :
        isSVGTag(key) ?
            NodeTypes.SVG_ELEMENT :
            NodeTypes.COMPONENT)
}



