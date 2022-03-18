// all is nodes
export enum Nodes {
    /*
        for compiler
    */
    NULL = 'null',


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
    COMMON_DIR = '--'
}

import {
    isHTMLTag, isSVGTag
} from './const'

//  keywords ===> NodeTypes
export const NodesMapping = Object.entries(Nodes).reduce((map: Record<string | number, string>, [key, value]: [string, string | number]) => {
    map[value] = key
    return map
}, Object.create(null))

/*
    input a keyword and return the nodetype,
    we can use it to parse the dom tags and attributes
*/
export const nodeTypeOf = (key: string) => {

}




