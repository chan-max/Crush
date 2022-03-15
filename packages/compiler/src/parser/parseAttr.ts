
import { NodeTypes } from '@crush/types'
import {
    AstNode,
} from './parseNode'

import {
    HTMLAttribute
} from './parseHTML'

import {
    makeMap
} from '@crush/common'

export const findAttrByName = (attrs: HTMLAttribute[], key: string) => {
    for (let i = 0; i < attrs.length; i++) {
        if (attrs[i].attribute === key) {
            return attrs[i].value
        }
    }
}


const extractAttr = /(@|\$|-{2})?(\()?([^\)]+)(\))?(?::(\w+))?/

export const parseAttribute = (node: AstNode) => {
    switch (node.type) {
        case NodeTypes.HTML_ELEMENT:
            node.attributes?.forEach((attr:HTMLAttribute) => {
                //todo
            })
            break
        case NodeTypes.IF:

            break
    }
}
