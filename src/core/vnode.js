var NODE_TYPE;
(function (NODE_TYPE) {
    NODE_TYPE[NODE_TYPE["ELEMENT"] = 1] = "ELEMENT";
})(NODE_TYPE || (NODE_TYPE = {}));
function _createStyleRule(selector, declaration) {
    return {
        selector,
        declaration,
        type: 1,
        ref: null
    };
}
function _createElement(tag, attrs, childNodes) {
    return {
        tag, attrs, childNodes,
        type: 'ELEMENT'
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
export {};
