
import { camelize, isUndefined } from "@crush/common"

// arguments , filters , modifiers
const attributeModifierRE = /(?::([\w:]+))?(?:\|([\w\|]+))?(?:\.([\w\.]+))?/


const AttributeFlags = [
    '$--', // dynamic css variable
    '--', // custo directive
    '...', // attribute bind shorthand
    '$', // dynamic property
    '@', // event
    '#', // id shorthand
    '.' // class shorthand
]

const AttributeEndFlags = [
    '!' // important css property
]


const staticAttributeNameRE = /[\w-]+/

// both for html attribute and css declaration
export function parseAttribute(attr: any) {
    let { attribute, value } = attr

    let flag, endFlag

    // 提取开始标志
    for (let _flag of AttributeFlags) {
        if (attribute.startsWith(_flag)) {
            flag = _flag
            attribute = attribute.slice(_flag.length)
            break
        }
    }

    // 提取结尾标志
    for (let _flag of AttributeEndFlags) {
        if (attribute.endsWith(_flag)) {
            endFlag = _flag
            attribute = attribute.slice(0, attribute.length - _flag.length - 1)
            break
        }
    }


    let isDynamicProperty, property, _arguments, filters, modifiers

    if (attribute.startsWith('(')) {
        let lastIndexOfBorder = attribute.lastIndexOf(')')
        property = attribute.slice(1, lastIndexOfBorder)
        isDynamicProperty = true
        let argumentsAndModifiers = attribute.slice(lastIndexOfBorder + 1) // 防止内部表达式太复杂解析出错
        var tokens = attributeModifierRE.exec(argumentsAndModifiers)
        let [_, __arguments, _modifiers]: any = tokens
        _arguments = __arguments && __arguments.split(':')
        modifiers = _modifiers && _modifiers.split('.')
    } else {
        isDynamicProperty = false
        // 非动态属性， 先提取出 属性名称
        property = (staticAttributeNameRE.exec(attribute) as any)[0]

        var tokens = attributeModifierRE.exec(attribute.slice(property?.length))
        let [_, __arguments, _filters, _modifiers]: any = tokens
        _arguments = __arguments && __arguments.split(':')
        filters = _filters && _filters.split('|')
        modifiers = _modifiers && _modifiers.split('.')
    }

    attr.isBooleanProperty = isUndefined(value)
    attr.isDynamicProperty = isDynamicProperty
    attr.isDynamicValue = flag === '$'
    attr._arguments = _arguments
    attr.modifiers = modifiers
    attr.filters = filters
    attr.property = attr.isDynamicProperty ? property : camelize(property)
    attr.value = value
    attr.flag = flag
    attr.endFlag = endFlag

    return attr
}