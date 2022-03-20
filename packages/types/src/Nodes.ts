// all is nodes
export enum Nodes {
    /*
        for compiler
    */
    NULL = 'null',

    /* fragment as builtin tags */
    FRAGMENT = 'fragment',

    /*
        directives and fragments
    */
    IF = "if",
    ELSE_IF = 'elseIf',
    ELSE = 'else',
    FOR = 'for',

    SVG_ELEMENT = 'svg',
    HTML_COMMENT = '!',
    TEXT = '',

    /* style element and style attribute */
    STYLE = 'style',

    DYNAMIC_CLASS = '$class',
    STATIC_CLASS = 'class',
    DYNAMIC_STYLE = '$style',

    AT_RULE = '@',

    MEDIA_RULE = 'media',
    SUPPORT_RULE = 'support',
    KEYFRAMES_RULE = 'keyframes',
    MIXIN = '...',
    HTML_ELEMENT = 'html_element',
    COMPONENT = 'component',

    STYLE_RULE = 'style_rule',

    KEYFRAME_RULE = "keyframe",
    DECLARATION = 'declaration',


    UNKNOWN = 'unknown',

    /*
    common directives flag , 
    builtin dir and custom dir
    and css dir
    */
    COMMON_DIR = '--',

    BUILTIN_DIRECTIVE = 'builtin_directive',
    CUSTOM_DIRECTIVE = 'custom_direvtive'
}

const NodesKey = {
    [Nodes.IF]: 'if'
}


import {
    isHTMLTag, isSVGTag
} from './const'

//  keywords ===> NodeTypes
export const NodesReverseMapping = Object.entries(Nodes).reduce((map: Record<string | number, string>, [key, value]: [string, string | number]) => {
    map[value] = key
    return map
}, Object.create(null))
/*
    input a keyword and return the nodetype,
    we can use it to parse the dom tags and attributes , directives and so on
*/
export const nodeTypeOf = (
    key: string,
    onlyUseNodesMap = false
    /*
        when input true ,
        if the map doesn't exist the nodetype , it will return undefined
        so we can do other things
    */
) => {
    // this key is nodeType value
    return NodesReverseMapping[key] ? key : (onlyUseNodesMap ? undefined : (
        isHTMLTag(key) ? Nodes.HTML_ELEMENT : isSVGTag(key) ? Nodes.SVG_ELEMENT : Nodes.COMPONENT
    ))
}




