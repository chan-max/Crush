
import { directiveTypeOf, Nodes, NodesMap, } from '@crush/types'
import {
} from './parseNode'

import {
    scopedExp
} from '../helper/scopedExp'
import { Asb } from './ast'

import {
    camelize,
    makeMap,
    exec
} from '@crush/common'
import { parseIterator } from './parseIterator'

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

const extAttribute = /(@|$|-{2})?(?:\(([^\)]+)\)|([\w-]+))(?::(\w+))?(?:\.([\w\.]+))?/

export const processAttribute = (node: Asb) => {
    const {
        type, attributes
    } = node;
    attributes?.forEach((attr) => {
        var exResult = exec(attr.attribute as string, extAttribute) as string[];
        const [flag, dynamicProperty, staticProperty, content, modifiers] = exResult;
        if (flag === NodesMap[Nodes.DIRECTIVE_FLAG]) {
            var dirName = camelize(staticProperty)
            const dirType = directiveTypeOf(dirName)
            attr.type = dirType
            switch (dirType) {
                case Nodes.IF:
                case Nodes.ELSE_IF:
                    attr.condition = attr.value;
                    (node.dirs ||= []).push(attr)
                    break
                case Nodes.ELSE:
                    (node.dirs ||= []).push(attr)
                    break
                case Nodes.FOR:
                    attr.iterator = parseIterator(attr.value as string);
                    (node.dirs ||= []).push(attr)
                    break
                case Nodes.CUSTOM_DIRECTIVE:
                    attr.dirName = dirName
                    attr.content = content
                    attr.modifiers = modifiers && modifiers.split('.');
                    (node.customDir ||= []).push(attr)
                    break
            }
        }
    })
}

