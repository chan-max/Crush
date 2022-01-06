var NODE_TYPE;
(function (NODE_TYPE) {
    NODE_TYPE[NODE_TYPE["HTMLELEMENT"] = 0] = "HTMLELEMENT";
    NODE_TYPE[NODE_TYPE["TEXT"] = 1] = "TEXT";
})(NODE_TYPE || (NODE_TYPE = {}));
function _createStyleRule(selector, declaration) {
    return {
        selector,
        declaration,
        type: 1,
        ref: null
    };
}
function createElement(tag, attrs, childNodes) {
    return {
        tag, attrs, childNodes,
        type: NODE_TYPE.HTMLELEMENT
    };
}
function createText(text) {
    return {
        type: NODE_TYPE.TEXT,
        text,
    };
}
function _createSVGElement(tag, attrs, childNodes) {
    return {
        tag, attrs, childNodes,
        type: 'SVGElement'
    };
}
function _createMediaRule(condition, ruleList) {
    return {
        condition,
        ruleList
    };
}
function _createKeyframesRule(name, ruleList) {
    return {
        name,
        ruleList
    };
}
export { createElement, createText };
var CSSRULE_TYPES;
(function (CSSRULE_TYPES) {
    CSSRULE_TYPES[CSSRULE_TYPES["STYLE_RULE"] = 0] = "STYLE_RULE";
    CSSRULE_TYPES[CSSRULE_TYPES["MEDIA_RULE"] = 1] = "MEDIA_RULE";
    CSSRULE_TYPES[CSSRULE_TYPES["KEYFRAMES_RULE"] = 2] = "KEYFRAMES_RULE";
})(CSSRULE_TYPES || (CSSRULE_TYPES = {}));
