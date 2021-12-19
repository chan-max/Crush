import { XML_CONTENT_TYPE } from "./declare"
import { getTheTagType, camelize } from "../shared/shared"

var RE_startTag = /^<([\w-]+)/ // 匹配开始标签，获取标签名
var RE_endTag = /^<\/([\w-]+)\s*>/
var RE_xml_comment = /^<!--(.*?)-->/
var RE_attributeValue = /=\s*(["'])([^\1]*?)(\1)/ // 获取属性值，用单引号或双引号包起来的非单引号或双引号的内容
var RE_attributeName = /([^=>\s]+)/ // 获取属性名 
var RE_text = /([^<]+)/

var inStartTag = false // 判断当前是否处于开始标签中，用于区分属性和文本

var currentTag = '' // 保存当前标签名

var attrubuteMap = {} // 保存

var attributeSet: any = []

var currentAttribute = ''

var willbeAttribueName = true

var expectAttributeValue = false

var $ = null

function cutString(str: string, length: number) {
    return str.substring(length).trimLeft()
} // 根据长度截取字符串，并且清空左空格

function* templateExtract(template: string): any {
    template = template.trimLeft()
    if (!template) {
        return
    }
    if ($ = RE_startTag.exec(template)) {
        var [{ length }, tagName]: any = $
        currentTag = tagName
        inStartTag = true
        yield* templateExtract(cutString(template, length))
    } else if ($ = RE_endTag.exec(template)) {
        var [{ length }, tagName]: any = $
        yield {
            type: XML_CONTENT_TYPE.CLOSE_TAG,
            tagName: camelize(tagName),
            tagType: getTheTagType(currentTag),
        }
        yield* templateExtract(cutString(template, length))
    } else if (inStartTag) {
        if (template[0] === '=') {
            var [{ length }, c, attributeValue]: any = RE_attributeValue.exec(template)
            attrubuteMap[currentAttribute] = attributeValue
            willbeAttribueName = true
            expectAttributeValue = false
            yield* templateExtract(cutString(template, length))
        } else if (template[0] === '>') {
            // 开始标签闭合
            if (expectAttributeValue && currentAttribute) { // 处理最后一个属性无闭合的情况
                attributeSet.push(currentAttribute)
            }

            yield {
                type: XML_CONTENT_TYPE.OPEN_TAG,
                tagName: camelize(currentTag),
                tagType: getTheTagType(currentTag),
                attrubuteMap,
                attributeSet
            }

            

            // 匹配一个开放标签后重置所有状态
            attrubuteMap = {}
            attributeSet = []
            inStartTag = false
            currentTag = ''
            currentAttribute = ''
            willbeAttribueName = true
            expectAttributeValue = false
            yield* templateExtract(cutString(template, 1))
        } else if (template[0] === '/') {
            // there is not must for us to decide a opentag is close or not by '/'
            yield* templateExtract(cutString(template, 1))
        } else if (willbeAttribueName) {
            var [{ length }, attributeName]: any = RE_attributeName.exec(template)
            currentAttribute = attributeName
            willbeAttribueName = false
            expectAttributeValue = true
            yield* templateExtract(cutString(template, length))
        } else {
            var [{ length }, attributeName]: any = RE_attributeName.exec(template)
            attributeSet.push(currentAttribute)
            currentAttribute = attributeName
            willbeAttribueName = true
            yield* templateExtract(cutString(template, length))
        }
    } else if($ = RE_xml_comment.exec(template)){
        var [{ length }, value]: any = $
        yield {
            type: XML_CONTENT_TYPE.COMMENT,
            value
        }
        yield* templateExtract(cutString(template, length))
    } else {
        // 处理文本内容
        var [{ length }, value]: any = RE_text.exec(template)
        yield {
            type: XML_CONTENT_TYPE.TEXT,
            value: value
        }
        yield* templateExtract(cutString(template, length))
    }
}

export {
    templateExtract
}




