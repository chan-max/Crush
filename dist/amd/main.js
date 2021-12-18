define(function () { 'use strict';

    // Crush Studio
    console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");
    var template = document.querySelector('#style').innerHTML;
    var RE_selector = /([^{};]*)\s*{/;
    var RE_propertyAndValue = /^([^;{}]+)\s*:\s*([^;]+);/;
    var $ = null;
    var selectorStack = []; // 维护选择器结构
    var currentDeclaration = null;
    var map = {};
    /* try to get the property and value */
    while (template = template.trimLeft()) {
        if ($ = RE_propertyAndValue.exec(template)) {
            var [{ length }, property, value] = $;
            currentDeclaration[property] = value;
            template = template.substring(length);
        }
        else {
            if (template[0] === '}') {
                selectorStack.pop();
                template = template.substring(1);
            }
            else {
                // 处理选择器
                var [{ length }, selector] = RE_selector.exec(template);
                selectorStack.push(selector);
                var realSelector = selectorStack.join(' ');
                currentDeclaration = map[realSelector] = {};
                template = template.substring(length);
            }
        }
    }
    console.log(map);
    var legal = /(?<!.)([$_a-zA-Z][$_a-zA-Z0-9]*)/g;
    var expression = 'num.a>0';
    console.log('=>', expression.replace(legal, '$'));

});
