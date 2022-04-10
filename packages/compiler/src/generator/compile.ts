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
    renderMethodsNameMap,
} from './source'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

class CodeBuffer {
    code = ''

    push(code: string) {
        this.code = this.code + code
    }

    newLine = () => this.code += '\n'

    tab = () => this.code += '\t'

    pushNewLine = (code: string) => {
        this.newLine()
        this.push(code)
        this.newLine()
    }

    getCode() {
        return this.code
    }
}

const RENDER_INSTANCE = 'instance'
const RENDER_METHODS = 'renderMethods'
const SCOPE = '_scope'


const defaultCompilerConfig = {
}

const extend = Object.assign

export function compile(template: string, config = defaultCompilerConfig) {

    config &&= extend(defaultCompilerConfig, config)

    var ast = parseTemplate(template)
    console.log('nodeast', ast)

    var code = new CodeBuffer()
    code.push(
        declare(
            `{\n${Object.values(renderMethodsNameMap).join(',\n')}\n}`
            , RENDER_METHODS
        )
    )

    code.newLine()

    code.push(declare(
        SCOPE,
        `${RENDER_INSTANCE}._scope`
    ))
    code.newLine()

    const transformContext = {
        code
    }

    const renderCode = genNodes(ast as any[], transformContext)

    const content = `
        with(${SCOPE}){
            return ${toArrowFunction(renderCode)}
        }
    `

    code.pushNewLine(content)

    /*  
        the dom template ast will alwways return an array
    */
    
    return createFunction(code.getCode(), RENDER_INSTANCE, RENDER_METHODS)
}

