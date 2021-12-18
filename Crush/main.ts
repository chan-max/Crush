// Crush Studio
console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");

var template: string = (document as any).querySelector('#style').innerHTML

var RE_selector: RegExp = /([^{};]*)\s*{/

var RE_propertyAndValue: RegExp = /^([^;{}]+)\s*:\s*([^;]+);/


var $ = null

var selectorStack: any = [] // 维护选择器结构

var currentDeclaration:any = null

var map = {}

/* try to get the property and value */
while (template = template.trimLeft()) {
    if ($ = RE_propertyAndValue.exec(template)) {
        var [{ length }, property, value] = $
        currentDeclaration[property] = value
        template = template.substring(length)
    } else {
        if (template[0] === '}') {
            selectorStack.pop()
            template = template.substring(1)
        } else {
            // 处理选择器
            var [{ length }, selector] = RE_selector.exec(template)!
            selectorStack.push(selector)
            var rule = {
                selector,
                declarations: {}
            }

            var realSelector = selectorStack.join(' ')
            currentDeclaration = map[realSelector] = {}
            template = template.substring(length)
        }
    }
}

console.log(map);

var legal = /(?<!.)([$_a-zA-Z][$_a-zA-Z0-9]*)/g

var expression = 'num.a>0'

console.log('=>',expression.replace(legal,'$'));


function scopedExpression(expression:string,) {
    
}







