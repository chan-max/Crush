import { TagTypes,tagTypeOf } from "../../common/tag-type/tagType"
import { camelize } from "../../common/string/transfromString"

var closeTagRE = /^<\/([\w-]+)\s*>/
var openTagRE = /^<([\w-]+)/
var DOMCommentRE = /<!--((.|[\r\n])*?)-->/
var attributeRE = /^([^=>\s]+)\s*=\s*(["'])([^\1]*?)(\2)/
var emptyAttributeRE = /^([^=>\s]+)/
var textRE = /([^<]+)/

const parseDOMTemplate = (template: string) => {
    var $: any, astTree = [], attributeCollection = [], inOpenTag = false, subLength = 0, currentTagName
    while (template = template.substring(subLength).trimStart()) {
        if (template[0] === '<') {
            if (template[1] === '/') { /* close */
                let [{ length }, tagName]: any = closeTagRE.exec(template)
                for (var i = astTree.length - 1; i >= 0; i--) {
                    if (astTree[i].closed) continue
                    if (astTree[i].tagName === tagName) {
                        astTree[i].closed = true
                        var children = astTree.splice(i + 1)
                        if (children) {
                            astTree[i].children = children
                        }           
                        break
                    }
                }
                subLength = length
            } else if (template[1] === '!') {  /* comment  */
                let [{ length }, comment]: any = DOMCommentRE.exec(template)
                astTree.push({
                    type: TagTypes.COMMENT,
                    comment
                })
                subLength = length
            } else { /* open */
                let [{ length }, tagName]: any = openTagRE.exec(template)
                currentTagName = tagName
                inOpenTag = true
                subLength = length
            }
        } else if (inOpenTag) { /* attributes */
            if (template[0] === '/') {
                /* there is not must for decide a opentag is close or not by '/' */
                subLength = 1
            } else if (template[0] === '>') {
                /*   tag close  */
                var tagName = camelize(currentTagName)
                var token: any = {
                    tagName,
                    attributeCollection,
                    type: tagTypeOf(tagName),
                    children: [],
                    closed: false
                }
                astTree.push(token)
                /* reset status */
                attributeCollection = []
                inOpenTag = false
                currentTagName = ''
                subLength = 1
            } else if ($ = attributeRE.exec(template)) {
                /*  try to catch the attr map  */
                let [{ length }, attribute, _, value]: any = $
                attributeCollection.push({
                    attribute, value
                })
                subLength = length
            } else {
                /* no value attribute */
                let [{ length }, attribute]: any = emptyAttributeRE.exec(template)
                attributeCollection.push({
                    attribute,
                    value: true
                })
                subLength = length
            }
        } else {
            /* text */
            let [{ length }, text]: any = textRE.exec(template)
            astTree.push({
                text,
                type: 'text'
            })
            subLength = length
        }
    }
    return astTree
}

export {
    parseDOMTemplate
}





