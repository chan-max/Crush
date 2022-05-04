
import { directiveTypeOf, Nodes, NodesMap, } from '@crush/types'
import {
} from './parseNode'

import {
    scopedExp
} from '../shared/scopedExp'
import { Asb } from './ast'

import {
    camelize,
    makeMap,
    exec
} from '@crush/common'
import { parseIterator } from './parseIterator'

import {
    removeFromArray
} from '@crush/common'

import {
    parseInlineClass
} from './specialAttr'

/*
    find the value of attribute list
*/
function findAttr(
    attrs: Asb[],
    validator: Function, // to decide a value is legal by attribute 
    getAll: boolean // should get all value 
) {
    var res: any
    for (let i = 0; i < attrs.length; i++) {
        var attr = attrs[i]
        if (validator(attr.attribute)) {
            if (getAll) {
                res ||= [];
                res.push(attr.value)
            } else {
                res = attr.value
                break
            }
        }
    }
    return res
}

export const findValueByattribute = (attrs: Asb[], attribute: string) => {
    return findAttr(attrs, (_attribute: string) => _attribute === attribute, false)
}
export const findValueByattributes = (attrs: Asb[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), false)
export const findValuesByattribute = (attrs: Asb[], attribute: string) => findAttr(attrs, (_attribute: string) => _attribute === attribute, true)
export const findValuesByattributes = (attrs: Asb[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), true)

const extAttribute = /(@|\$|-{2})?(\()?([\w-]+)(\()?(?::(\w+))?(?:\.([\w\.]+))?/

var fnIsCalled = /.+\([\w,]*\)$/

export const processAttribute = (node: any) => {
    const { type, attributes } = node;
    if (!attributes) return
    for (let i = 0; i < attributes.length; i++) { // not destructur becasue keep the node
        const attr = attributes[i]
        var exResult = exec(attr.attribute as string, extAttribute) as string[];
        var [flag, l, property, r, argument, modifierList]: any = exResult;
        var isDynamicProperty = l && r
        var isDynamicValue = flag === '$'
        var modifiers = modifierList && modifierList.split('.')
        // process directive
        if (flag === NodesMap[Nodes.DIRECTIVE_FLAG]) {
            // directive effect the root node
            var dirName = camelize(property)
            const dirType = directiveTypeOf(dirName)
            attr.type = dirType
            switch (dirType) {
                case Nodes.IF:
                    if (!node.dirs) {
                        //  此时为元素的第一个指令为if ， 最外层的分支指令会注入到元素节点 ， 在代码生成时用作判断处理
                        node.condition = attr.value
                        node.isBranchStart = true
                    } else {
                        attr.condition = attr.value;
                        node.dirs.push(attr)
                    }
                    break
                case Nodes.ELSE_IF:
                    if (!node.dirs) {
                        node.condition = attr.value
                        node.isBranch = true
                    } else {
                        // else-if 指令只会在第一个指令出现
                    }
                    break
                case Nodes.ELSE:
                    if (!node.dirs) {
                        node.isBranch = true
                    } else {
                        // else-if 指令只会在第一个指令出现
                    }
                    break
                case Nodes.FOR:
                    attr.iterator = parseIterator(attr.value as string);
                    (node.dirs ||= []).push(attr)
                    break
                case Nodes.CUSTOM_DIRECTIVE:
                    attr.dirName = dirName
                    attr.argument = argument
                    attr.modifiers = modifiers
                        (node.customDirs ||= []).push(attr)
                    break
            }
            /*
                attributes 中的内置和自定义指令都会被移出
                编译时指令放在dirs中，
                内置或自定义指令放在customDirs中
            */
            removeFromArray(attributes, attr)
            i--
            // 因为删除了数组中的元素，所以指针回退一步
        } else if (flag === NodesMap[Nodes.AT]) {
            // the events attributeValue will always be dynamicMapKey
            /*
                support :
                methods name : @click="login"
                expression : @click="login = true" //此时需要包裹一层函数
                function : @click="function(){ ... }"
                arrow function : @click="() => { ... }"
            */
            attr.type = Nodes.EVENT
            attr.isDynamicValue = true
            attr.isCalled = fnIsCalled.test(attr.value)
            attr.argument = argument
            attr.modifiers = modifiers
            attr.isDynamicProperty = isDynamicProperty
            attr.property = property
        } else if (property === NodesMap[Nodes.CLASS]) {
            // contain dynamic class and static class
            attr.type = Nodes.CLASS
            attr.isDynamicValue = isDynamicValue
        } else if (property === NodesMap[Nodes.STYLE]) {
            attr.type = Nodes.STYLE
            attr.isDynamicValue = isDynamicValue
        } else {
            //  normal attribute
            attr.property = property
            attr.argument = argument
            attr.modifiers = modifiers
            attr.isDynamicValue = isDynamicValue
            attr.isDynamicProperty = isDynamicProperty
        }
    }
}

