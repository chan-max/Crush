import { isArray, isNumber, isObject } from "../shared/dataType";
const createStyleRuleNode = (selector, declaration, config) => ({ type: 0 /* STYLERULE */, selector, declaration, config });
const createMediaRuleNode = (condition, rules) => ({ type: 2 /* MEDIARULE */, condition, rules });
const createKeyframesRuleNode = (name, rules) => ({ type: 1 /* KEYFRAMESRULE */, name, rules });
const createKeyframeRuleNode = (key, declaration, config) => ({ type: 3 /* KEYFRAMERULE */, key, declaration, config });
// background-color:red; => ....
function toStyleMapString(property, value, important, config) {
    return isObject(value) ? Object.entries(value).map(([v1, v2]) => {
        return toStyleMapString(property + '-' + v1, v2, important, config);
    }).join('') : `${property}:${isArray(value) ?
        value.reduce((res, valueItem) => res + ' ' + (isNumber(valueItem) ? valueItem + config.unit : valueItem), '') : isNumber(value) ?
        value + config.unit : value}${important ? ' !important' : ''};`;
}
// mount single styleRule , for instance, body{...styleMap}
function createStyleRuleString(selector, declaration, config) {
    return `${selector}{${Object.entries(declaration).map(([property, { value, important }]) => toStyleMapString(property, value, important, config)).join('')}}`;
}
function mountRule(styleSheet, rule, index) {
    if (rule.type === 2 /* MEDIARULE */) {
        styleSheet.insertRule(`@media ${rule.condition}{}`, index);
        updateStyleSheet(styleSheet.cssRules[index], rule.rules);
    }
    else if (rule.type === 1 /* KEYFRAMESRULE */) {
        styleSheet.insertRule(`@keyframes ${rule.name}{}`, index);
        updateStyleSheet(styleSheet.cssRules[index], rule.rules);
    }
    else if (rule.type === 0 /* STYLERULE */) {
        styleSheet.insertRule(createStyleRuleString(rule.selector, rule.declaration, rule.config), index);
    }
    else if (rule.type === 3 /* KEYFRAMERULE */) {
        styleSheet.appendRule(createStyleRuleString(rule.key, rule.declaration, rule.config), index);
    }
}
function updateStyleSheet(sheet, rules) {
    rules.forEach((rule, index) => {
        mountRule(sheet, rule, index);
    });
}
var style = document.querySelector('#style').sheet;
const styleRender = (config = { unit: 'px', url: '../images/' }) => {
    return [
        createMediaRuleNode('screen and (min-width:500px)', [
            createStyleRuleNode('body', {
                border: {
                    important: true,
                    value: '100px solid green'
                },
                animation: {
                    important: true,
                    value: 'a 3s infinite'
                }
            }, config)
        ]),
        createKeyframesRuleNode('a', [
            createKeyframeRuleNode('0%', {
                ['background-color']: {
                    value: 'red', important: false
                }
            }, config),
            createKeyframeRuleNode('100%', {
                ['background-color']: {
                    value: 'blue', important: false
                }
            }, config)
        ])
    ];
};
function test() {
    updateStyleSheet(style, styleRender());
    console.log(styleRender());
}
export { test };
