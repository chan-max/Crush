"use strict";
const uniqueNode = new Proxy({}, { get() { return Symbol(); } });
const emptyNode = {};
// mark a sight property for style rules
// 转驼峰
function camelCase(str) {
    var re = /-(\w)/g;
    return str.replace(re, function (_, $) {
        return $.toUpperCase();
    });
}
// 转下划线
function kababCase(str) {
    return str.replace(/([A-Z])/g, (_, $) => {
        return '-' + $.toLowerCase();
    });
}
// 样式规则转字符串
function styleRuleToStr(styleRule) {
    return Object.entries(styleRule.declaration).reduce((resStr, el) => {
        return resStr + kababCase(el[0]) + ':' + el[1] + ';';
    }, styleRule.selector + '{') + '}';
}
function updateStyleRule(prev, next) {
    const style = prev.ref.style;
    const prevDeclaration = prev.declaration;
    const nextDeclaration = next.declaration;
    const prevKeys = Object.keys(prevDeclaration);
    const nextKeys = Object.keys(nextDeclaration);
    prevKeys.forEach((key) => {
    });
}
function updateDeclaration(declaration, prevDeclaration, nextDeclaration) {
    var prevKeys = Object.keys(prevDeclaration);
    var nextKeys = Object.keys(nextDeclaration);
    nextKeys.forEach((key, index) => {
        if (prevDeclaration[key] !== nextDeclaration[key]) {
            declaration[key] = nextDeclaration[key];
        }
        prevKeys.splice(index, 1);
    });
    prevKeys.forEach((key) => {
        declaration[key] = "";
    });
}
// 更新样式表，递归调用
function updateRules(prevRules, nextRules, sheet) {
    for (let i = 0, len = nextRules.length; i < len; i++) {
        let prevRule = prevRules[i]?._vnode_ || uniqueNode;
        let nextRule = nextRules[i];
        let nextRuleType = nextRule.type;
        if (prevRule.type === nextRuleType) {
            switch (nextRuleType) {
                case 'CSSStyleRule':
                    updateStyleRule(prevRule, nextRule);
                    break;
            }
        }
        else {
            sheet.insertRule(styleRuleToStr(nextRule), i);
            nextRule.ref = sheet.cssRules[i];
            mark(sheet.cssRules[i], '_vnode_', nextRule);
        }
    }
}
const style = document.querySelector('style');
function renderStyle(styleElement, ruleList) {
    const sheet = styleElement.sheet;
    return updateRules(sheet.cssRules || [], ruleList, sheet);
}
