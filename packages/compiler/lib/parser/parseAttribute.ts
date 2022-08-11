
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

// 合法的属性名称
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


    let isDynamicProperty, property, decorators

    if (attribute.startsWith('(')) {
        // dynamic attribute
        let lastIndexOfBorder = attribute.lastIndexOf(')')
        property = attribute.slice(1, lastIndexOfBorder)
        isDynamicProperty = true
        let argumentsAndModifiers = attribute.slice(lastIndexOfBorder + 1) // 防止内部表达式太复杂解析出错

    } else {
        isDynamicProperty = false
        // 非动态属性， 先提取出 属性名称
        property = (staticAttributeNameRE.exec(attribute) as any)[0]
        decorators = attribute.slice(property?.length)
    }

    let _arguments, filters, modifiers

    if (decorators) {
        let tokens: any = decorators.split(/(?=[\.|:])/)
        tokens.forEach((token: any) => {
            if (token[0] === ':') {
                (_arguments ||= []).push(token.slice(1))
            } else if (token[0] === '|') {
                (filters ||= []).push(token.slice(1))
            } else if (token[0] === '.') {
                (modifiers ||= []).push(token.slice(1))
            }
        });
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