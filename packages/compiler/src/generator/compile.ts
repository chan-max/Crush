
import {
    parseHTML
} from '../parser/parseHTML'

import {
    AstNode,
    parseNodes
} from '../parser/parseNode'

import {
    genNodes
} from '../generator/generator'


export function compile(template: string) {
    const htmlAst = parseHTML(template)
    console.log('htmlast', htmlAst)
    parseNodes(htmlAst as AstNode[])
    console.log('nodeast', htmlAst)
    const code = genNodes(htmlAst as AstNode[])
    return code
}

