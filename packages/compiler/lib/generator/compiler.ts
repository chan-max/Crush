

import {
    baseParseHTML
} from '../parser/baseParseHTML'
import {
    processAst
} from '../parser/processAst'

import {
    genNodes
} from './codegen'

import {
    toArrowFunction,
    declare,
    callFn
} from '../stringify'

import { uVar } from '@crush/common'

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
            , 'renderMethods'))
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

    setScope() {

    }

}


export function compile(template: string) {

    var ast = baseParseHTML(template)
    processAst(ast)

    var context = new CodeGenerator()
    // 初始化所有渲染方法

    // 模板的渲染作用域
    var SCOPE = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'))

    const renderCode: any = genNodes(ast, context)

    const content = `
        with(${SCOPE}){
            return ${toArrowFunction(renderCode)} // the return function is render function
        }    
    `

    context.pushNewLine(content)

    var renderFunction = createFunction(context.getCode(), 'renderMethods')
    console.log(renderFunction);
    return renderFunction
}

