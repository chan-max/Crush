
import { Nodes, nodeTypeOf } from '@crush/types'
import {
    AstNode,
} from './parseNode'

import {
    HTMLAttribute
} from './parseHTML'

import {
    camelize,
    makeMap,
    exec
} from '@crush/common'

/*
    find the value of attribute list
*/
function findAttr(
    attrs: HTMLAttribute[],
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

import {
    parseIterator
} from './parseIterator'
import {
    scopedExp
} from '../helper/scopedExp'

const findValueByattribute = (attrs: HTMLAttribute[], attribute: string) => findAttr(attrs, (_attribute: string) => _attribute === attribute, false)
const findValueByattributes = (attrs: HTMLAttribute[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), false)
const findValuesByattribute = (attrs: HTMLAttribute[], attribute: string) => findAttr(attrs, (_attribute: string) => _attribute === attribute, true)
const findValuesByattributes = (attrs: HTMLAttribute[], attributes: string[]) => findAttr(attrs, (attribute: string) => attributes.includes(attribute), true)


// not allow to use ( ) for dynamic property



const isCompileDir = makeMap('if,elseIf,else,for,slot,slotDef')

const extAttribute = /(@|$|-{2})?(?:\(([^\)]+)\)|([\w-]+))(?::(\w+))?(?:\.([\w\.]+))?/


export const processAttribute = (node: AstNode) => {
    switch (node.type) {
        case Nodes.IF:
            node.compileDir = [{
                type: Nodes.IF,
                content: scopedExp(findValueByattribute(node.attributes as HTMLAttribute[], '--'))
            }]
            break
        case Nodes.ELSE_IF:
            node.compileDir = [{
                type: Nodes.ELSE_IF,
                content: scopedExp(findValueByattribute(node.attributes as HTMLAttribute[], '--'))
            }]
            break
        case Nodes.ELSE:
            node.compileDir = [{
                type: Nodes.ELSE
            }]
            break
        case Nodes.FOR:
            node.compileDir = [{
                type: Nodes.FOR,
                content: parseIterator(findValueByattribute(node.attributes as HTMLAttribute[], '--'))
            }]
            break
        case Nodes.HTML_ELEMENT:
            node.attributes?.forEach(({ attribute, value }) => {
                var [flag, dynamicAttr, staticAttr, name, modifier]: any = exec(attribute, extAttribute)
                if (flag === '@') {
                    
                } else if (flag === '--') {
                    /* dirctive doesnt suppoort dynamic */
                    const directiveName = camelize(staticAttr)
                    if (isCompileDir(directiveName)) {
                        switch (directiveName as Nodes) {
                            case Nodes.IF:
                                (node.compileDir ||= []).push({
                                    type: Nodes.IF,
                                    content: value
                                })
                                break
                            case Nodes.ELSE_IF:
                                (node.compileDir ||= []).push({
                                    type: Nodes.ELSE_IF,
                                    content: value
                                })
                                break
                            case Nodes.ELSE:
                                (node.compileDir ||= []).push({
                                    type: Nodes.ELSE,
                                    content: value
                                })
                                break
                            case Nodes.FOR:
                                (node.compileDir ||= []).push({
                                    type: Nodes.FOR,
                                    content: parseIterator(value as string)
                                })
                                break
                        }
                    }
                }
            })
            break
        case Nodes.COMPONENT:
            /*
                no special attribute
            */
            break
        case Nodes.SVG_ELEMENT:
            break
    }
}

