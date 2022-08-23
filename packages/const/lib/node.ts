
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

    RENDER_COMPONENT, // 纯渲染函数
    
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


