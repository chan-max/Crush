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

    RESERVED_PROP,

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
    MODEL
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

import { makeMap } from '@crush/common'
import {
    isHTMLTag, isSVGTag
} from './const'

export function keyOf(nodeType: Nodes): string {
    return NodesMap[nodeType]
}

export const directiveTypeOf = (dirName: string) => {
    return NodesMap[dirName as any] || Nodes.CUSTOM_DIRECTIVE
}

export const tagTypeOf = (tagName: string) => {
    return NodesMap[tagName as any] ||
        (isHTMLTag(tagName) ?
            Nodes.HTML_ELEMENT : isSVGTag(tagName) ?
                Nodes.SVG_ELEMENT : Nodes.COMPONENT)
}

// 保留属性
export function toReservedProp(name: string) {
    return `_${name}`
}


export const isReservedProp = makeMap('created,beforeMount,mounted,beforeUpdate,updated,beforeUnmount,unmounted,')

