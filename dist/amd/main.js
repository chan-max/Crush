define(function () { 'use strict';

    // Crush Studio
    console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");
    var template = document.querySelector('#style').innerHTML;
    var RE_selector = /([^{};]*)\s*{/;
    var RE_propertyAndValue = /^([^;{}]+)\s*:\s*([^;]+);/;
    console.log(RE_propertyAndValue.exec(template));
    var $ = null;
    var res = [];
    var selectorStack = [];
    var currentRule = null;
    /* try to get the property and value */
    while (template.trimLeft()) {
        if ($ = RE_propertyAndValue.exec(template)) {
            var [{ length: any }, property, value] = $;
            currentRule.declarations[property] = value;
            template = template.substring(length).trimLeft();
        }
        else {
            if (template[0] === '}') {
                res.push(selectorStack.pop());
            }
            else {
                // 处理选择器
                var [{ length: any }, selector] = RE_selector.exec(template);
                currentRule = selectorStack.push({
                    selector,
                    declarations: {}
                });
                template = template.substring(length).trimLeft();
            }
        }
    }
    console.log(res);

});
