
import { error, camelize, execCaptureGroups, isUndefined } from "@crush/common"

const argumentsAndModifiersRE = /(?::([\w:]+))?(?:\.([\w\.]+))?/

enum AttributeFlag {
    '$--', // dynamic css variable
    '--', // custo directive
    '...', // attribute bind shorthand
    '$', // dynamic property
    '@', // event
    '#', // id shorthand
    '.' // class shorthand
}

enum AttributeEndFlag {
    '!' // important css property
}


// both for html attribute and css declaration
export function parseAttribute(attr: any) {
    let { attribute, value } = attr

    let flag, endFlag

    // 提取开始标志
    for (let _flag in AttributeFlag) {
        if (attribute.startsWith(_flag)) {
            flag = _flag
            attribute = attribute.slice(_flag.length)
            break
        }
    }

    // 提取结尾标志
    for (let _flag in AttributeEndFlag) {
        if (attribute.endsWith(_flag)) {
            endFlag = _flag
            attribute = attribute.slice(0, attribute.length - _flag.length - 1)
            break
        }
    }


    let isDynamicProperty, property, _arguments, modifiers

    if (attribute.startsWith('(')) {
        let lastIndexOfBorder = attribute.lastIndexOf(')')
        property = attribute.slice(1, lastIndexOfBorder)
        isDynamicProperty = true
        let argumentsAndModifiers = attribute.slice(lastIndexOfBorder + 1) // 防止内部表达式太复杂解析出错
        var tokens = argumentsAndModifiersRE.exec(argumentsAndModifiers)
        let [_, __arguments, _modifiers]: any = tokens
        _arguments = __arguments && __arguments.split(':')
        modifiers = _modifiers && _modifiers.split('.')
    } else {
        isDynamicProperty = false
        var tokens = argumentsAndModifiersRE.exec(attribute)
        let [_, __arguments, _modifiers]: any = tokens
        _arguments = __arguments && __arguments.split(':')
        modifiers = modifiers && _modifiers.split('.')
        property = attribute.slice(0, attribute.length - _.length)
    }

    attr.isBooleanProperty = isUndefined(value)
    attr.isDynamicProperty = isDynamicProperty
    attr.isDynamicValue = flag === '$'
    attr._arguments = _arguments
    attr.modifiers = modifiers
    attr.property = attr.isDynamicProperty ? property : camelize(property)
    attr.value = value
    attr.flag = flag
    attr.endFlag = endFlag
    return attr
}