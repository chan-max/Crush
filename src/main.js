// Crush Studio
console.log("%cCrush Studio", "color: #333;  font-size: 10px; font-weight:bold;");
var template = ` 

    <div name = "hahaha"  $id = "a>0? '1':'2' " @click="add()">
        <h1>这是一个标题</h1>
    </div>


`;
const YES = true;
const NO = false;
const UNKNOWN = Symbol('unknown');
// 解析html 初始阶段
var isJavaScriptExpression = NO;
var MUSTBE = UNKNOWN;
var MAYBE = 123;
var RE = /\s*([^\s="]+)\s*/g;
function extract() {
    return RE.exec(template);
}
var RE_startTag = /(^<[(!)(/)([\w-])])/;
console.log(RE_startTag.test(template));
while (!template) {
    if (template[0] === '<') {
        if (template[1] === '') {
        }
    }
    else {
        // 一定是文本
    }
}
export {};
