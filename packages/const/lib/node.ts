
export const enum Nodes {

    NULL, /* null */

    FRAGMENT,

    TEMPLATE, /* the built-in tag template */

    IF,
    ELSE_IF,
    ELSE,
    FOR,

    ATTRIBUTE,

    DOM_ELEMENT,

    SVG_ELEMENT,
    HTML_COMMENT,

    DYNAMIC_ELEMENT,

    TEXT,
    HTML_ELEMENT,
    COMPONENT,
    DYNAMIC_COMPONENT,

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
    OUTLET,

    // form binding
    MODEL,

    RESERVED_PROP,

    SKIP
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
    'slot' = Nodes.SLOT,
    'outlet' = Nodes.OUTLET,
    '...' = Nodes.MIXIN,
    '@' = Nodes.AT,
    '--' = Nodes.DIRECTIVE_FLAG,
    'media' = Nodes.MEDIA_RULE,
    'keyframes' = Nodes.KEYFRAMES_RULE,
    'supports' = Nodes.SUPPORTS_RULE,
    'style' = Nodes.STYLE,
    'class' = Nodes.CLASS,
    'template' = Nodes.TEMPLATE,
    'element' = Nodes.DYNAMIC_ELEMENT,
    'component' = Nodes.DYNAMIC_COMPONENT,
    'model' = Nodes.MODEL
}

export function keyOf(nodeType: any) :any{
    return NodesMap[nodeType]
}

