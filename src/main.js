"use strict";
var template = `
    <div>
        <h1> 666 666 6666 </h1>
    </div>
`;
var RE_openTag = /^<([\w-]+)/;
var RE_closeTag = /^<\/([\w-]+)\s*>/;
var RE_attributeName = /([^=>\s]+)/; // 获取属性名 
var RE_attributeValue = /=\s*(["'])([^\1]*?)(\1)/;
var RE_text = /([^<]+)/;
function extractTemplateToAst(template) {
    var $ = null;
    var currentTagName = '';
    var currentAttributeName = '';
    var attributeMap = {};
    var attributeSet = [];
    var inStartTag = false;
    var willbeAttributeName = false;
    var willbeAtributeValue = false;
    while (template = template.trimStart()) {
        if ($ = RE_openTag.exec(template)) {
            var [{ length }, tagName] = $;
            currentTagName = tagName;
            inStartTag = true;
            template = template.substring(length);
        }
        else if ($ = RE_closeTag.exec(template)) {
            var [{ length }, tagName] = $;
            var token = {
                tagName,
                type: 'close'
            };
            log2(token);
            template = template.substring(length);
        }
        else if (inStartTag) {
            if (template[0] === '=') {
                var [{ length }, border, attributeValue] = RE_attributeValue.exec(template);
                attributeMap[currentAttributeName] = attributeValue;
                willbeAttributeName = true;
                willbeAtributeValue = false;
                template = template.substring(length);
            }
            else if (template[0] === '/') {
                // there is not must for us to decide a opentag is close or not by '/'
                template = template.substring(1);
            }
            else if (template[0] === '>') {
                if (willbeAtributeValue && currentAttributeName) { // 处理最后一个属性无闭合的情况
                    attributeSet.push(currentAttributeName);
                }
                var token = {
                    tagName: currentTagName,
                    attributeMap,
                    attributeSet,
                    type: 'open'
                };
                log2(token);
            }
            else {
                var [{ length }, attributeName] = RE_attributeName.exec(template);
                if (willbeAttributeName) {
                    currentAttributeName = attributeName;
                    willbeAttributeName = false;
                    willbeAtributeValue = true;
                }
                else {
                    attributeSet.push(currentAttributeName);
                    currentAttributeName = attributeName;
                    willbeAttributeName = true;
                }
                template = template.substring(length);
            }
        }
        else {
            var [{ length }, value] = RE_text.exec(template);
            var token = {
                type: 'text',
                value
            };
            log2(token);
            template = template.substring(length);
        }
    }
}
extractTemplateToAst(template);
function log2(x) {
    console.log(x);
}
