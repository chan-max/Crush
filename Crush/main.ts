// Crush Studio
console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");

var template: string = (document as any).querySelector('#style').innerHTML
var RE_propertyAndValue: RegExp = /^([^;{}]+)\s*:\s*([^;]+);/
var RE_selector: RegExp = /([^{};]*)(?<!\s)\s*{/
var $ = null
var stack: any = [] // 维护选择器结构
var res:any = []
/* try to get the property and value */
while (template = template.trimLeft()) {
    if ($ = RE_propertyAndValue.exec(template)) {
        // 处理规则属性
        var [{ length }, property, value] = $
        stack[stack.length - 1].declarations[property] = value
        template = template.substring(length)
    } else if (template[0] === '}') {
        // 层叠表闭合  
        stack.pop()
        template = template.substring(1)
    } else if (template.startsWith('--')) {
        // 处理指令
    } else if (template.startsWith('@')) {
        // 处理媒体查询，动画等 todo
    } else {
        // 统一当作选择器来处理
        var [{ length }, selector] = RE_selector.exec(template)!
        
        var rule= {
            type:'style',
            selector,
            declarations: {},
            children:[]
        };

        if(!stack.length){
            res.push(rule)
        }else{
            stack[stack.length - 1 ].children.push(rule)
        }

        stack.push(rule)

        template = template.substring(length)
    }
}

console.log(res);

/*
1 html div
2

*/











