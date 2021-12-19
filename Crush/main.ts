// Crush Studio
console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");
import { extractCascadingStyleSheet } from "./compiler/extractCascadingStyleSheet";
var template: string = (document as any).querySelector('#style').innerHTML


var ast = extractCascadingStyleSheet(template)

console.log(ast);



var Resrules:any = []

function loop(rules:any) {
    rules.forEach( (rule:any) => {
        var selector = rule.selector
        var parent = rule.parent
        while(parent){
            selector = parent.selector + selector
            parent = parent.parent
        }
        var r:any = {
            selector,
            declaration:rule.declaration
        }
        Resrules.push(r)
        loop(rule.children)
    });
}














