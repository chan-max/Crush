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
import { uVar } from '@crush/common/src/value'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

class CodeGenerator {

    code: string

    methods: Record<string, boolean>

    constructor() {
        this.code = ''
        this.methods = {}
    }

    getCode = () => {
        this.unshift(declare(
            `{${Object.keys(this.methods).join(',')}}`
            , RENDER_METHODS))
        return this.code
    }
    push = (code: string) => this.code += code
    unshift = (code: string) => this.code = code + this.code
    newLine = () => this.code += '\n'
    tab = () => this.code += '\t'

    pushNewLine(code: string) {
        this.newLine()
        this.push(code)
    }

    // input an expression and hoist to the context , and return the variable name
    hoistExpression(expression: string): string {
        var varname = uVar()
        this.pushNewLine(declare(varname, expression))
        return varname
    }

    callRenderFn(fn: string, ...args: string[]): string {
        this.methods[fn] = true
        return callFn(fn, ...args)
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

    var SCOPE = context.hoistExpression(context.callRenderFn(renderMethodsNameMap.getCurrentScope))
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

