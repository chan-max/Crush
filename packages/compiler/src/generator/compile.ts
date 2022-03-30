import {
    parseTemplate
} from '../parser/parseNode'

import {
    genNodes
} from '../generator/generator'

import {
    toArrowFunction,
    declare
} from '../generator/stringify'

import {
    Source,

} from './source'

export const createFunction = (returned: string, content: string, ...params: string[]) => new Function(...params, `${content} return ${returned}`)

class CodeBuffer {
    code = ''
    push(code: string) {
        this.code = this.code + code
    }
    newLine = () => this.code += '\n'
    tab = () => this.code += '\t'
    getCode() {
        return this.code
    }
}

const RENDER_INSTANCE = 'instance'
const RENDER_METHODS = 'renderMethods'
const SCOPE = 'scope'

export function compile(template: string) {
    var ast = parseTemplate(template)
    console.log('nodeast', ast)

    var code = new CodeBuffer()
    code.push(
        declare(
            `{\n${Object.values(Source).join(',\n')}\n}`
            , RENDER_METHODS
        )
    )

    code.newLine()

    code.push(declare(
        SCOPE,
        `${RENDER_INSTANCE}.scope`
    ))
    code.newLine()

    console.log(code);

    const vnode = genNodes(ast as any[])
    return createFunction(toArrowFunction(vnode), code.getCode(), RENDER_INSTANCE, RENDER_METHODS)
}

