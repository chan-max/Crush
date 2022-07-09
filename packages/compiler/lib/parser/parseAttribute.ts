
import { error, camelize, execCaptureGroups, isUndefined } from "@crush/common"

const extAttributeRE = /(\$-{2}|@|\$|-{2}|\.|#)?(\()?([\w-\?]+)(\))?(?::([\w:]+))?(?:\.([\w\.]+))?(@|\$|!|\.|#)?/

// both for html attribute and css declaration
export function parseAttribute(attr: any) {
    let { attribute, value } = attr
    var res = execCaptureGroups(attribute, extAttributeRE)
    if (!res) {
        return
    }
    var [flag, left, property, right, argumentStr, modifierStr, endFlag]: string[] = res

    attr.isBooleanProperty = isUndefined(value)
    attr.isDynamicProperty = !!(left && right)
    attr.isDynamicValue = flag === '$'
    attr._arguments = argumentStr && argumentStr.split(':')
    attr.modifiers = modifierStr && modifierStr.split('.')
    attr.property = attr.isDynamicProperty ? property : camelize(property)
    attr.value = value
    attr.flag = flag
    attr.endFlag = endFlag
    attr.left = left
    attr.right = right

    return attr
}