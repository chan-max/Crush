export const enum Nodes {
    EMPTY = 'empty node',
    FRAGMENT = 'FRAGMENT',
    HTMLELEMENT = 'HTML ELEMENT',
    SVGELEMENT = 'SVG ELEMENT',
    COMPONENT = 'COMPONENT',
    TEXT = 'TEXT',
    RESERVED = 'reserved',
    COMMENT = 'comment',
    /*  style   */
    STYLE = 'style',
    SHEET = 'sheet',
    CSSCOMMENT = 'CSS comment',
    DECLARATION = 'declaration',
    MIXIN = 'declaration mixin',
    STYLERULE = 'style rule',
    MEDIARULE = 'media rule',
    KEYFRAMESRULE = 'keyframes rule',
    KEYFRAMERULE = 'keyframe rule',
    SUPPORTRULE = 'support rule',

    IF = 'if',
    ELSEIF = 'elseIf',
    ELSE = 'else',
    FOR = 'for',

    EVENT = 'events',
    ATTRIBUTE = 'attributes',
    DIRECTIVE = 'directives'
}