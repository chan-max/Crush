// all is nodes
export enum Nodes {

    NULL, /* null */

    FRAGMENT, /* fragment for fragment tag , css directive */

    TEMPLATE, /* the built-in tag template */

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

    // class contain dynamic class and static class
    CLASS,
    DYNAMIC_CLASS,
    STATIC_CLASS,

    AT,

    MEDIA_RULE,
    SUPPORTS_RULE,
    KEYFRAMES_RULE,

    EVENT, // events , elements and components

    STYLE_RULE,

    KEYFRAME_RULE,


    /*
     declarationGroup is contain declaratin and mixin
    */
    DECLARATION_GROUP,
    DECLARATION,
    MIXIN,

    UNKNOWN,

    DIRECTIVE_FLAG,

    BUILTIN_DIRECTIVE,
    CUSTOM_DIRECTIVE,

    // use slot
    SLOT,
    // define slot
    DEFINE_SLOT
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
    'supports' = Nodes.SUPPORTS_RULE,
    'style' = Nodes.STYLE,
    'class' = Nodes.CLASS,
    'template' = Nodes.TEMPLATE,
    'slot' = Nodes.SLOT,
    'defineSlot' = Nodes.DEFINE_SLOT
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

