import {
    parseTemplate
} from '../parser/parseNode'

import {
    genNodes
} from '../generator/generator'

import {
    toArrowFunction,
    declare,
    callFn
} from '../generator/stringify'

import {
    renderMethodsNameMap,
} from './source'
import { uvar } from '@crush/common/src/value'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

class CodeGenerator {
    code = ''
    getCode = () => this.code
    push = (code: string) => this.code += code
    newLine = () => this.code += '\n'
    tab = () => this.code += '\t'

    pushNewLine = (code: string) => {
        this.newLine()
        this.push(code)
        this.newLine()
    }

    // input an expression and hoist to the context , and return the variable name
    hoistExpression = (expression: string) => {
        var varname = uvar()
        this.pushNewLine(declare(varname, expression))
        return varname
    }

}



const RENDER_METHODS = 'renderMethods'

const defaultCompilerConfig = {

}

import {
    extend
} from '@crush/common'

export function compile(template: string, config = defaultCompilerConfig) {

    config &&= extend(defaultCompilerConfig, config)

    var ast = parseTemplate(template)
    console.log('nodeast', ast)

    var context = new CodeGenerator()
    // 初始化所有渲染方法
    context.push(
        declare(
            `{\n${Object.values(renderMethodsNameMap).join(',\n')}\n}`
            , RENDER_METHODS
        )
    )

    var SCOPE = context.hoistExpression(callFn(renderMethodsNameMap.getCurrentScope))

    const renderCode = genNodes(ast as any[], context)

    const content = `
        with(${SCOPE}){
            return ${toArrowFunction(renderCode)} // the return function is render function
        }    
    `

    context.pushNewLine(content)

    /*  
        the dom template ast will alwways return an array
    */

    return createFunction(context.getCode(), RENDER_METHODS)
}

