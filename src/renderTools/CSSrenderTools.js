// css render tools and virtual stylesheet , rules
var ST_CSSStyleRule = function (selector, declarations) {
    this.type = 'styleRule';
    this.selector = selector;
    this.declarations = declarations;
};
ST_CSSStyleRule.prototype.getCSSText = function () {
    var selector = this.selector;
    var declarations = this.declarations;
    var declarationsString = Object.keys(declarations).reduce(function (res, key) { return "" + res + key + ":" + declarations[key] + ";"; }, '');
    return selector + "{" + declarationsString + "}";
};
var createRule = function (selector, declarations) {
    return new ST_CSSStyleRule(selector, declarations);
};
// CSSStyleSheet
var ST_CSSStyleSheet = function (st) {
};
export { createRule };
