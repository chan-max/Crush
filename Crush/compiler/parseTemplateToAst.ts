
var RE_openTag = /^<([\w-]+)/
var RE_closeTag = /^<\/([\w-]+)\s*>/
var RE_attributeName = /([^=>\s]+)/ // 获取属性名 
var RE_attributeValue = /=\s*(["'])([^\1]*?)(\1)/
var RE_text = /([^<]+)/
function parseTemplateToAst(template: string) {
    var $ = null
    var currentTagName = ''
    var currentAttributeName = ''
    var attributeMap = {}
    var attributeSet = []
    var inStartTag = false
    var willbeAttributeName = true
    var willbeAttributeValue = false
    var astTree = []
    while (template = template.trimStart()) {
        if ($ = RE_openTag.exec(template)) {
            var [{ length }, tagName] = $
            currentTagName = tagName
            inStartTag = true
            template = template.substring(length)
        } else if ($ = RE_closeTag.exec(template)) {
            var [{ length }, tagName] = $
            var token: any = {
                tagName,
                type: 'close'
            }
            template = template.substring(length)

            for(var i = astTree.length -1; i>=0; i--){
                if(astTree[i].closed)continue
                if(astTree[i].tagName === token.tagName){
                    astTree[i].closed = true
                    var children = astTree.splice(i + 1)
                    if(children){
                        astTree[i].children = children
                    }
                    break
                }
            }

        } else if (inStartTag) {
            if (template[0] === '=') {
                var [{ length }, border, attributeValue] = RE_attributeValue.exec(template)!
                attributeMap[currentAttributeName] = attributeValue
                willbeAttributeName = true
                willbeAttributeValue = false
                template = template.substring(length)
            } else if (template[0] === '/') {
                // there is not must for us to decide a opentag is close or not by '/'
                template = template.substring(1)
            } else if (template[0] === '>') {
                if (willbeAttributeValue && currentAttributeName) { // 处理最后一个属性无闭合的情况
                    attributeSet.push(currentAttributeName)
                }
                var token: any = {
                    tagName: currentTagName,
                    attributeMap,
                    attributeSet,
                    type: 'open',
                    children:[],
                    closed:false
                }
                attributeMap = {}
                attributeSet = []
                inStartTag = false
                currentTagName = ''
                currentAttributeName = ''
                willbeAttributeName = true
                willbeAttributeValue = false
                template = template.substring(1)
                astTree.push(token)
            } else {
                var [{ length }, attributeName] = RE_attributeName.exec(template)!
                if (willbeAttributeName) {
                    currentAttributeName = attributeName
                    willbeAttributeName = false
                    willbeAttributeValue = true
                } else {
                    attributeSet.push(currentAttributeName)
                    currentAttributeName = attributeName
                    willbeAttributeName = true
                }
                template = template.substring(length)
            }
        } else {
            var [{ length }, value] = RE_text.exec(template)!
            var token: any = {
                type: 'text',
                value
            }
            astTree.push(token)
            template = template.substring(length)
        }
    }
    return astTree
}

export {
    parseTemplateToAst
}
