

import {
    baseParseHTML
} from '../parser/baseParseHTML'

import {
    genNodes
} from './codegen'

import {
    toArrowFunction,
    declare,
    callFn
} from '../stringify'

import { uVar } from '@crush/common'
import { createExpression } from '../withScope'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

export class CodeGenerator {

    compilerOptions: any

    code: string

    // 记录使用的方法
    methods: Record<string, boolean>

    renderScope: any
    scope: any

    constructor() {
        this.code = ''
        this.methods = {}
    }

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
        let expInstance = createExpression(exp)
        expInstance.pushScope(this.scopes)
        return expInstance.scopedExpression(this.renderScope)
    }

    scopes: any = []

    pushScope(scope: any) {
        this.scopes.push(scope)
    }

    popScope() {
        this.scopes.pop()
    }
}

import { isHTMLTag, isSVGTag } from '@crush/const'

const compilerDefaultOptions: any = {
    isHTMLTag,
    isSVGTag
}

import { processTemplateAst } from '../parser/parseTemplate'

export function compile(template: string, compilerOptions: any = compilerDefaultOptions) {

    var context = new CodeGenerator()

    context.compilerOptions = compilerOptions

    // 初始化渲染作用域
    context.renderScope = context.hoistExpression(context.callRenderFn('getCurrentRenderScope'))
    context.scope = context.hoistExpression(context.callRenderFn('getCurrentScope'))

    var htmlAst = baseParseHTML(template)

    processTemplateAst(htmlAst, context)

    console.log(htmlAst);

    const renderCode: any = genNodes(htmlAst, context)


    const content = `return ${toArrowFunction(renderCode)}`

    context.pushNewLine(content)

    var renderFunction = createFunction(context.getCode(), 'renderMethods')
    console.log(renderFunction);

    return renderFunction
}

