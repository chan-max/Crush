
import { error, camelize,execCaptureGroups , isUndefined  } from "@crush/common"


const extAttributeRE = /(\$-{2}|@|\$|-{2}|\.|#)?(\()?([\w-\?]+)(\))?(?::([\w:]+))?(?:\.([\w\.]+))?(@|\$|!|\.|#)?/

// both for html attribute and css declaration
export function parseAttribute(attribute: string, value: string) {
    var res = execCaptureGroups(attribute, extAttributeRE)
    if (!res) {
        error(`${attribute} is not legal attribute`)
        return
    }
    var [flag, left, property, right, argumentStr, modifierStr, endFlag]: string[] = res
    var isBooleanProperty = isUndefined(value)
    var isDynamicProperty = !!(left && right)
    var isDynamicValue = flag === '$'
    var _arguments = argumentStr && argumentStr.split(':')
    var modifiers = modifierStr && modifierStr.split('.')
    if (!isDynamicProperty) {
        property = camelize(property)
    }
    return {
        isBooleanProperty,
        property,
        isDynamicProperty, 
        isDynamicValue,
        value,
        flag,
        endFlag,
        left,
        right,
        _arguments,
        modifiers
    }
}