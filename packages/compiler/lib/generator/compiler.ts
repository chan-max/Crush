

import {
    baseParseHTML
} from '../parser/baseParseHTML'

import {
    genNodes
} from './codegen'

import {
    toArrowFunction,
    declare,
    callFn,
    toBackQuotes
} from '../stringify'

import { uVar } from '@crush/common'
import { createExpression, expressionWithScope } from '../withScope'

export const createFunction = (content: string, ...params: string[]) => new Function(...params, `${content}`)

export class CodeGenerator {

    compilerOptions: any

    code: string

    // 记录使用的方法
    methods: any = {}
    components: any = {}
    directives: any = {}


    renderScope: any
    scope: any

    // 记录模板中是否使用了scoped css
    useScopedStyleSheet = false

    constructor() {
        this.code = ''
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

    useComponent(name: string, isDynamic: boolean) {
        if (isDynamic) {
            return this.callRenderFn('getComponent', name)
        } else {
            if (this.components[name]) {
                return this.components[name]
            } else {
                let component = this.hoistExpression(this.callRenderFn('getComponent', toBackQuotes(name)))
                this.components[name] = component
                return component
            }
        }
    }

    useDirective(name: string, isDynamic: boolean) {
        if (isDynamic) {
            return this.callRenderFn('getDirective', name)
        } else {
            if (this.directives[name]) {
                return this.directives[name]
            } else {
                let directive = this.hoistExpression(this.callRenderFn('getDirective', toBackQuotes(name)))
                this.directives[name] = directive
                return directive
            }
        }
    }

    parseExpressionWithRenderScope(exp: string) {
        let expInstance = createExpression(exp)
        expInstance.pushScope(this.scopes)
        let setScopedExpression = expInstance.scopedExpression(this.renderScope)
        let variables = expInstance.variables
        return {
            expression: setScopedExpression,
            variables
        }
    }

    parseExpressionWithRawScope(exp: string) {
        let expInstance = createExpression(exp)
        let setScopedExpression = expInstance.scopedExpression(this.renderScope)
        let variables = expInstance.variables
        return {
            expression: setScopedExpression,
            variables
        }
    }

    setRenderScope(exp: string) {
        let expInstance = createExpression(exp)
        expInstance.pushScope(this.scopes)
        return expInstance.scopedExpression(this.renderScope)
    }

    setRawScope(exp: string) {
        // 原生作用域不会受到模板的影响
        let expInstance = createExpression(exp)
        return expInstance.scopedExpression(this.scope)
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

    let renderCode: any = genNodes(htmlAst, context)

    const content = `return ${toArrowFunction(renderCode)}`

    context.pushNewLine(content)

    var renderFunction = createFunction(context.getCode(), 'renderMethods')
    console.log(renderFunction);

    return {
        createRender: renderFunction,
        useScopedStyleSheet: context.useScopedStyleSheet
    }
}

