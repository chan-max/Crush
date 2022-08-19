

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
import { expressionWithScope, SetScopeContext } from '../withScope'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

class CodeGenerator {

    code: string

    // 记录使用的方法
    methods: Record<string, boolean>

    renderScope: any
    scope: any

    constructor() {
        this.code = ''
        this.methods = {}
    }

    scopeContext = new SetScopeContext()

    getCode = () => {
        this.unshift(declare(`{${Object.keys(this.methods).join(',')}}`, 'renderMethods'))
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

    setRenderScope(exp: string) {
        return expressionWithScope(exp, this.scopeContext)
    }

    pushScope(scope: any) {
        this.scopeContext.pushScope(scope)
    }

    popScope() {
        this.scopeContext.popScope()
    }
}

const compilerDefaultOptions: any = [

]

export function compile(template: string, compilerOptions: any = compilerDefaultOptions) {

    var context = new CodeGenerator()




    // 初始化渲染作用域
    context.renderScope = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'))
    context.scope = context.hoistExpression(context.callRenderFn('getCurrentScope'))
    // 初始化所有渲染方法
    context.scopeContext.scope = context.renderScope

    var htmlAst = baseParseHTML(template)

    debugger

    processAst(htmlAst)

    const renderCode: any = genNodes(htmlAst, context)

    const content = `return ${toArrowFunction(renderCode)} // the return function is render function`

    context.pushNewLine(content)

    var renderFunction = createFunction(context.getCode(), 'renderMethods')
    console.log(renderFunction);
    return renderFunction
}

